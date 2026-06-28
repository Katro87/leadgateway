import { Link, useLocation, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Phone, Users, MessageSquare, Voicemail, Settings } from 'lucide-react'

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Dialer', path: '/dialer', icon: Phone, tab: 'calls' },
  { name: 'Messages', path: '/dialer', icon: MessageSquare, tab: 'messages' },
  { name: 'Voicemail', path: '/dialer', icon: Voicemail, tab: 'voicemail' },
  { name: 'Contacts', path: '/contacts', icon: Users },
  { name: 'Settings', path: '/settings', icon: Settings },
]

function Sidebar() {
  const location = useLocation()
  const navigate = useNavigate()

  const isActive = (item) => {
    if (item.tab) {
      const params = new URLSearchParams(location.search || window.location.hash.split('?')[1]);
      const currentTab = params.get('tab') || 'calls';
      return currentTab === item.tab;
    }
    return location.pathname === item.path && !window.location.hash.includes('tab=');
  }

  const handleClick = (item) => {
    if (item.tab) {
      sessionStorage.setItem('dialerTab', item.tab);
      navigate(`/dialer?tab=${item.tab}`);
    }
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
          return item.tab ? (
            <button
              key={item.name}
              onClick={() => handleClick(item)}
              title={item.name}
              className={`w-full flex items-center justify-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors group relative ${
                active
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              <Icon size={20} />
              <span className="absolute left-14 bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-50 hidden group-hover:block">
                {item.name}
              </span>
            </button>
          ) : (
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