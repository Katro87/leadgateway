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

  return (
    <aside className="w-60 bg-gray-800 border-r border-gray-700 flex flex-col h-screen">
      <div className="px-6 py-5 border-b border-gray-700">
        <h1 className="text-xl font-bold text-white">LeadGateway</h1>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path.split('?')[0]
          const Icon = item.icon
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              <Icon size={18} />
              {item.name}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}

export default Sidebar