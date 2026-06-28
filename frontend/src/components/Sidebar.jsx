import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, Phone, Users, MessageSquare, Voicemail, Settings } from 'lucide-react'

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Dialer', path: '/dialer', icon: Phone },
  { name: 'Messages', path: '/dialer?tab=messages', icon: MessageSquare },
  { name: 'Contacts', path: '/contacts', icon: Users },
  { name: 'Voicemail', path: '/voicemail', icon: Voicemail },
  { name: 'Settings', path: '/settings', icon: Settings },
]

function Sidebar() {
  const location = useLocation()

  const isActive = (item) => {
    const currentPath = location.pathname;
    const currentSearch = location.search || '';
    const itemPath = item.path.split('?')[0];
    const itemSearch = item.path.includes('?') ? '?' + item.path.split('?')[1] : '';

    if (itemSearch) {
      return currentPath === itemPath && currentSearch === itemSearch;
    }
    return currentPath === itemPath && !currentSearch.includes('tab=');
  }

  return (
    <aside className="w-16 lg:w-16 bg-gray-800 border-r border-gray-700 flex flex-col h-screen">
      <div className="px-3 py-5 border-b border-gray-700 flex justify-center">
        <Phone size={22} className="text-blue-400" />
      </div>

      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const active = isActive(item)
          const Icon = item.icon
          return (
            <Link
              key={item.name}
              to={item.path}
              title={item.name}
              className={`flex items-center justify-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors group relative ${
                active
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              <Icon size={20} />
              <span className="absolute left-14 bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-50 hidden group-hover:block">
                {item.name}
              </span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}

export default Sidebar