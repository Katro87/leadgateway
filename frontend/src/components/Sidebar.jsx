import { Link, useLocation } from 'react-router-dom'

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: '📊' },
  { name: 'Dialer', path: '/dialer', icon: '📞' },
  { name: 'Contacts', path: '/contacts', icon: '👤' },
  { name: 'Messages', path: '/messages', icon: '💬' },
  { name: 'Call History', path: '/call-history', icon: '📋' },
  { name: 'Voicemail', path: '/voicemail', icon: '📼' },
  { name: 'Settings', path: '/settings', icon: '⚙️' },
]

function Sidebar() {
  const location = useLocation()

  return (
    <aside className="w-60 bg-gray-800 border-r border-gray-700 flex flex-col h-screen">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-gray-700">
        <h1 className="text-xl font-bold">LeadGateway</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path
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
              <span>{item.icon}</span>
              {item.name}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}

export default Sidebar