import { NavLink } from 'react-router-dom'
import Icon from './Icon'

const navItems = [
  { label: 'Pipeline', icon: 'pipeline', to: '/' },
  { label: 'Conversations', icon: 'conversations', to: '/conversation/inbox' },
  { label: 'Metrics', icon: 'metrics', to: '/metrics' },
]

function isActivePath(itemPath, currentPath) {
  if (itemPath === '/') {
    return currentPath === '/'
  }

  if (itemPath.startsWith('/conversation')) {
    return currentPath.startsWith('/conversation')
  }

  return currentPath === itemPath
}

export default function Sidebar({ currentPath }) {
  return (
    <>
      <aside className="border-border/80 fixed inset-y-0 left-0 z-40 hidden w-72 flex-col border-r bg-[#0b0b0b] px-5 py-6 lg:flex">
        <div className="mb-10 flex items-center gap-3 px-2">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15 ring-1 ring-primary/20">
            <Icon name="pipeline" className="text-primary" />
          </div>
          <div>
            <p className="text-2xl font-bold tracking-tight text-primary">ZolvoReach</p>
            <p className="text-[10px] uppercase tracking-[0.28em] text-zinc-500">
              AI Sales Operations
            </p>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              className={`nav-link ${isActivePath(item.to, currentPath) ? 'nav-link-active' : ''}`}
            >
              <Icon name={item.icon} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <button
          type="button"
          className="mb-8 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-bg transition-transform duration-150 active:scale-[0.98]"
        >
          New Campaign
        </button>

        <div className="space-y-1 border-t border-border pt-6">
          <button
            type="button"
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm text-zinc-400 transition-colors hover:text-primary"
          >
            <Icon name="settings" />
            <span>Settings</span>
          </button>
          <button
            type="button"
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm text-zinc-400 transition-colors hover:text-primary"
          >
            <Icon name="help" />
            <span>Support</span>
          </button>

          <div className="mt-6 flex items-center gap-3 px-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-zinc-900 text-xs font-semibold text-primary">
              AI
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-muted">AI Agent Alpha</p>
              <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">
                System Online
              </p>
            </div>
          </div>
        </div>
      </aside>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-[#0b0b0b]/95 px-3 py-2 backdrop-blur lg:hidden">
        <div className="grid grid-cols-3 gap-2">
          {navItems.map((item) => {
            const active = isActivePath(item.to, currentPath)

            return (
              <NavLink
                key={item.label}
                to={item.to}
                className={`flex flex-col items-center gap-1 rounded-xl px-3 py-2 text-[11px] font-medium transition-colors ${
                  active ? 'bg-primary/10 text-primary' : 'text-zinc-400'
                }`}
              >
                <Icon name={item.icon} />
                <span>{item.label}</span>
              </NavLink>
            )
          })}
        </div>
      </nav>
    </>
  )
}
