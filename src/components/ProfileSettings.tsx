import { useState } from 'react'
import { MBTI_TYPES } from '../content/mbti'
import type { MbtiType } from '../content/mbti'
import type { Profile } from '../storage'
import { setProfile } from '../storage'
import { useI18n } from '../i18n'
import Card from './Card'

interface Props {
  initial: Profile
  onSave: (profile: Profile) => void
}

export default function ProfileSettings({ initial, onSave }: Props) {
  const { t } = useI18n()
  const [birthday, setBirthday] = useState(initial.birthday ?? '')
  const [mbti, setMbti] = useState<MbtiType | ''>(initial.mbti ?? '')
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    const next: Profile = { birthday: birthday || undefined, mbti: mbti || undefined }
    setProfile(next)
    onSave(next)
    setSaved(true)
    setTimeout(() => setSaved(false), 1500)
  }

  return (
    <Card>
      <p className="mb-3 text-sm font-medium">{t.profile.title}</p>

      <label className="mb-1 block text-xs text-white/50">{t.profile.birthdayLabel}</label>
      <input
        type="date"
        value={birthday}
        onChange={(e) => setBirthday(e.target.value)}
        className="mb-3 w-full rounded-xl border border-white/10 bg-white/[0.04] p-2 text-sm"
      />

      <label className="mb-1 block text-xs text-white/50">{t.profile.mbtiLabel}</label>
      <select
        value={mbti}
        onChange={(e) => setMbti(e.target.value as MbtiType | '')}
        className="mb-3 w-full rounded-xl border border-white/10 bg-white/[0.04] p-2 text-sm"
      >
        <option value="">{t.profile.mbtiPlaceholder}</option>
        {MBTI_TYPES.map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </select>

      <button
        onClick={handleSave}
        className="w-full rounded-xl bg-gradient-to-r from-vibe-600 to-vibe-500 py-2.5 text-sm font-semibold shadow-glow transition active:scale-95"
      >
        {saved ? t.profile.saved : t.profile.save}
      </button>
    </Card>
  )
}
