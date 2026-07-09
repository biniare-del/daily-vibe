import type { CloudUser } from '../cloudSync'
import { isCloudEnabled, signInWithGoogle, signOutCloud } from '../cloudSync'
import { useI18n } from '../i18n'
import Card from './Card'

interface Props {
  user: CloudUser | null
  syncing: boolean
}

export default function CloudBackup({ user, syncing }: Props) {
  const { t } = useI18n()

  return (
    <Card>
      <p className="mb-1 text-sm font-medium">{t.cloud.title}</p>

      {!isCloudEnabled() ? (
        <p className="text-xs text-white/40">{t.cloud.notConfigured}</p>
      ) : user ? (
        <>
          <p className="mb-3 text-xs text-white/50">
            {syncing ? t.cloud.syncing : t.cloud.signedInAs(user.email ?? user.id)}
          </p>
          <button
            onClick={signOutCloud}
            className="w-full rounded-xl border border-white/10 bg-white/[0.04] py-2.5 text-sm font-medium transition active:scale-95"
          >
            {t.cloud.logoutButton}
          </button>
        </>
      ) : (
        <>
          <p className="mb-3 text-xs text-white/50">{t.cloud.signedOutDescription}</p>
          <button
            onClick={signInWithGoogle}
            className="w-full rounded-xl bg-gradient-to-r from-vibe-600 to-vibe-500 py-2.5 text-sm font-semibold shadow-glow transition active:scale-95"
          >
            {t.cloud.loginButton}
          </button>
        </>
      )}
    </Card>
  )
}
