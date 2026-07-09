import { todayKey } from './storage'

const LAST_SHOWN_KEY = 'daily-vibe:reminder-last-shown'

export function notificationsSupported(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window
}

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!notificationsSupported()) return 'denied'
  if (Notification.permission !== 'default') return Notification.permission
  return Notification.requestPermission()
}

async function showNotification(title: string, body: string): Promise<void> {
  if (!notificationsSupported() || Notification.permission !== 'granted') return
  const registration = await navigator.serviceWorker?.getRegistration()
  if (registration) {
    registration.showNotification(title, { body, icon: '/icons/icon-192.png' })
  } else {
    new Notification(title, { body, icon: '/icons/icon-192.png' })
  }
}

/**
 * Best-effort reminder: only fires while the app/tab is open, since a true
 * background push (works even when the app is closed) requires a server
 * sending Web Push messages. This checks on load/visibility-change instead.
 */
export function maybeShowReminder(hasCheckedInToday: boolean, reminderTime: string): void {
  if (hasCheckedInToday) return
  if (Notification.permission !== 'granted') return

  const [h, m] = reminderTime.split(':').map(Number)
  const now = new Date()
  const target = new Date()
  target.setHours(h, m, 0, 0)
  if (now < target) return

  const today = todayKey()
  if (localStorage.getItem(LAST_SHOWN_KEY) === today) return

  localStorage.setItem(LAST_SHOWN_KEY, today)
  showNotification('오늘의 바이브 기록할 시간이에요 ✨', '30초면 충분해요. 오늘 기분을 남겨보세요.')
}
