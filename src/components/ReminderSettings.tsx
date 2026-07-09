import { useState } from 'react'
import type { ReminderSettings } from '../storage'
import { setReminderSettings } from '../storage'
import { notificationsSupported, requestNotificationPermission } from '../notifications'

interface Props {
  initial: ReminderSettings
}

export default function ReminderSettingsPanel({ initial }: Props) {
  const [settings, setSettings] = useState(initial)
  const [permission, setPermission] = useState<NotificationPermission>(
    notificationsSupported() ? Notification.permission : 'denied'
  )

  const update = (next: ReminderSettings) => {
    setSettings(next)
    setReminderSettings(next)
  }

  const handleToggle = async () => {
    if (!settings.enabled) {
      const result = await requestNotificationPermission()
      setPermission(result)
      if (result !== 'granted') return
    }
    update({ ...settings, enabled: !settings.enabled })
  }

  return (
    <div className="rounded-2xl bg-white/5 p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium">매일 리마인더</p>
          <p className="mt-1 text-xs text-white/40">
            {settings.enabled ? `매일 ${settings.time}에 알림` : '알림 꺼짐'}
          </p>
        </div>
        <button
          onClick={handleToggle}
          className={`h-7 w-12 rounded-full transition ${settings.enabled ? 'bg-vibe-600' : 'bg-white/10'}`}
        >
          <span
            className={`block h-5 w-5 rounded-full bg-white transition ${
              settings.enabled ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      {settings.enabled && (
        <input
          type="time"
          value={settings.time}
          onChange={(e) => update({ ...settings, time: e.target.value })}
          className="mt-3 w-full rounded-xl bg-white/5 p-2 text-sm"
        />
      )}

      {permission === 'denied' && (
        <p className="mt-2 text-[11px] text-red-300/70">
          브라우저 알림 권한이 차단되어 있어요. 기기 설정에서 허용해주세요.
        </p>
      )}
      <p className="mt-2 text-[11px] text-white/30">
        * 앱이 열려 있을 때 기준으로 확인하는 방식이에요. 앱을 완전히 꺼도 알림이 오게 하려면 서버
        기반 푸시(Web Push) 연동이 필요해요.
      </p>
    </div>
  )
}
