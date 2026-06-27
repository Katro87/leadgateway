import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Topbar() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setTimeout(() => navigate('/login'), 300);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) navigate(`/contacts?search=${encodeURIComponent(search.trim())}`);
  };

  const toggleTheme = () => {
    document.documentElement.classList.toggle('light');
    localStorage.setItem('theme', document.documentElement.classList.contains('light') ? 'light' : 'dark');
  };

  return (
    <header className="h-16 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-6">
      <form onSubmit={handleSearch} className="flex-1 max-w-md">
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Search contacts..." className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors" />
      </form>

      <div className="flex items-center gap-3">
        <button className="text-gray-400 hover:text-white transition-colors relative cursor-pointer" title="Notifications">
          🔔
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">3</span>
        </button>

        <div className="relative" ref={dropdownRef}>
          <button onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors cursor-pointer" title="Account menu">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-xs font-medium">
              {user.name ? user.name.split(' ').map(n => n[0]).join('') : 'U'}
            </div>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-xl shadow-lg py-1 z-50">
              <button onClick={() => { navigate('/profile'); setDropdownOpen(false); }}
                className="w-full text-left px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors">
                👤 Profile
              </button>
              <button onClick={() => { toggleTheme(); setDropdownOpen(false); }}
                className="w-full text-left px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors">
                🌓 Theme
              </button>
              <hr className="border-gray-700 my-1" />
              <button onClick={handleLogout}
                className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-gray-700 transition-colors">
                🚪 Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Topbar