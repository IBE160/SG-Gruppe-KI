
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signOut } from '@/lib/supabaseClient'; // Adjust path as needed

// Helper component for Material Symbols
const MaterialSymbol = ({ name, className }: { name: string; className?: string }) => (
  <span className={`material-symbols-outlined ${className}`}>{name}</span>
);

const PrivacySettingItem = ({ icon, title, description, href, isDestructive = false }: { icon: string; title: string; description?: string; href?: string; isDestructive?: boolean }) => {
  const content = (
    <div className={`flex min-h-[72px] cursor-pointer items-center gap-4 rounded p-4 transition-colors ${isDestructive ? 'hover:bg-red-500/10' : 'hover:bg-white/5'}`}>
      <div className={`flex size-12 shrink-0 items-center justify-center rounded-lg ${isDestructive ? 'bg-red-500/20 text-red-500' : 'bg-primary/20 text-primary'}`}>
        <MaterialSymbol name={icon} className="text-2xl" />
      </div>
      <div className="flex flex-1 flex-col justify-center">
        <p className={`text-base font-medium leading-normal ${isDestructive ? 'text-red-500' : 'text-white'}`}>{title}</p>
        {description && <p className="text-sm font-normal leading-normal text-zinc-400">{description}</p>}
      </div>
      <div className="shrink-0">
        <MaterialSymbol name="chevron_right" className="text-2xl text-zinc-500" />
      </div>
    </div>
  );

  return href ? <Link href={href}>{content}</Link> : <>{content}</>;
};


export default function PrivacyAndAccountPage() {
  const router = useRouter();

  const handleLogout = async () => {
    const success = await signOut();
    if (success) {
      router.push('/login'); // Redirect to login page after successful logout
    } else {
      // Handle logout error (e.g., show a toast notification)
      console.error('Logout failed');
    }
  };

  return (
    <div className="relative mx-auto flex h-screen min-h-screen w-full max-w-md flex-col overflow-hidden bg-background-dark font-display text-white">
      {/* Top App Bar */}
      <header className="flex shrink-0 items-center justify-between px-4 py-3">
        <Link href="/settings" className="flex size-10 items-center justify-center">
          <MaterialSymbol name="arrow_back_ios_new" className="text-2xl" />
        </Link>
        <h1 className="flex-1 text-center text-xl font-bold leading-tight tracking-tight">Privacy & Account</h1>
        <div className="size-10" /> {/* Spacer */}
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto px-4 pb-24">
        <div className="space-y-6">
          {/* Privacy Section */}
          <div>
            <h2 className="mb-2 px-4 text-sm font-medium uppercase tracking-wider text-primary/60">Privacy</h2>
            <div className="space-y-2 rounded-lg bg-black/20 p-2">
              <PrivacySettingItem icon="shield_person" title="Consent Settings" description="Manage data collection and personalization" />
              <PrivacySettingItem icon="link_off" title="Revoke Integrations" description="Manage connections to third-party apps" />
            </div>
          </div>

          {/* Account Management Section */}
          <div>
            <h2 className="mb-2 px-4 text-sm font-medium uppercase tracking-wider text-primary/60">Account Management</h2>
            <div className="space-y-2 rounded-lg bg-black/20 p-2">
              <PrivacySettingItem icon="person" title="User Profile Management" href="/settings/profile" />
              <PrivacySettingItem icon="download_for_offline" title="Export My Data" href="/settings/privacy/export-data" />
              <PrivacySettingItem icon="delete_forever" title="Delete My Account" href="/settings/privacy/delete-account" isDestructive />
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <div className="mt-8">
          <button
            onClick={handleLogout}
            className="flex h-14 w-full items-center justify-center rounded-lg bg-primary text-center text-base font-bold text-black transition-opacity hover:opacity-90"
          >
            Logout
          </button>
        </div>
      </main>

      {/* Bottom Navigation Bar */}
      <nav className="absolute bottom-0 left-0 right-0 border-t border-white/10 bg-background-dark/80 backdrop-blur-lg">
        <div className="mx-auto flex h-20 max-w-md items-center justify-around px-2 text-zinc-400">
          <Link href="/dashboard" className="flex flex-col items-center justify-center gap-1 text-center">
            <MaterialSymbol name="dashboard" className="text-2xl" />
            <span className="text-xs font-medium">Dashboard</span>
          </Link>
          <Link href="/workout" className="flex flex-col items-center justify-center gap-1 text-center">
            <MaterialSymbol name="play_circle" className="text-2xl" />
            <span className="text-xs font-medium">Workout</span>
          </Link>
          <Link href="/history" className="flex flex-col items-center justify-center gap-1 text-center">
            <MaterialSymbol name="history" className="text-2xl" />
            <span className="text-xs font-medium">History</span>
          </Link>
          <Link href="/settings" className="flex flex-col items-center justify-center gap-1 text-center text-primary">
            <MaterialSymbol name="settings" className="text-2xl" style={{ fontVariationSettings: "'FILL' 1" }} />
            <span className="text-xs font-bold">Settings</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}

