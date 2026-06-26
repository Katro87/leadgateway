import { useNavigate } from 'react-router-dom';

function Topbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <header className="h-16 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-6">
      {/* Search */}
      <div className="flex-1 max-w-md">
        <input
          type="text"
          placeholder="Search contacts, calls..."
          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
        />
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        <button className="text-gray-400 hover:text-white transition-colors relative cursor-pointer">
          🔔
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
            3
          </span>
        </button>

        {/* Profile */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-xs font-medium">
              {user.name ? user.name.split(' ').map(n => n[0]).join('') : 'U'}
            </div>
            <span className="hidden sm:inline">{user.name || 'User'}</span>
          </div>
          <button
            onClick={handleLogout}
            className="text-gray-400 hover:text-white text-sm transition-colors cursor-pointer"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  )
}

export default Topbar