import { useContext, useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import AuthContext from '../../context/AuthContext'

const Header = () => {
  const { isAuthenticated, user, logout } = useContext(AuthContext)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isAdminDropdownOpen, setIsAdminDropdownOpen] = useState(false)
  const adminDropdownRef = useRef(null)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const toggleAdminDropdown = () => {
    setIsAdminDropdownOpen(!isAdminDropdownOpen)
  }

  const handleLogout = () => {
    logout()
    setIsMenuOpen(false)
    setIsAdminDropdownOpen(false)
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (adminDropdownRef.current && !adminDropdownRef.current.contains(event.target)) {
        setIsAdminDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <header className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold">Schedule Master</Link>

          <div className="hidden md:flex space-x-4 items-center">
            {isAuthenticated ? (
              <>
                <Link to="/" className="hover:text-blue-200">Home</Link>

                {user && user.role === 'admin' && (
                  <div className="relative" ref={adminDropdownRef}>
                    <button
                      className="hover:text-blue-200 focus:outline-none"
                      onClick={toggleAdminDropdown}
                    >
                      Admin {isAdminDropdownOpen ? '▲' : '▼'}
                    </button>
                    {isAdminDropdownOpen && (
                      <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                        <div className="py-1">
                          <Link
                            to="/admin"
                            className="block px-4 py-2 text-gray-800 hover:bg-blue-500 hover:text-white"
                            onClick={() => setIsAdminDropdownOpen(false)}
                          >
                            Dashboard
                          </Link>
                          <Link
                            to="/admin/classes"
                            className="block px-4 py-2 text-gray-800 hover:bg-blue-500 hover:text-white"
                            onClick={() => setIsAdminDropdownOpen(false)}
                          >
                            Classes
                          </Link>
                          <Link
                            to="/admin/subjects"
                            className="block px-4 py-2 text-gray-800 hover:bg-blue-500 hover:text-white"
                            onClick={() => setIsAdminDropdownOpen(false)}
                          >
                            Subjects
                          </Link>
                          <Link
                            to="/admin/teachers"
                            className="block px-4 py-2 text-gray-800 hover:bg-blue-500 hover:text-white"
                            onClick={() => setIsAdminDropdownOpen(false)}
                          >
                            Teachers
                          </Link>
                          <Link
                            to="/admin/timeslots"
                            className="block px-4 py-2 text-gray-800 hover:bg-blue-500 hover:text-white"
                            onClick={() => setIsAdminDropdownOpen(false)}
                          >
                            Time Slots
                          </Link>
                          <Link
                            to="/admin/timetable"
                            className="block px-4 py-2 text-gray-800 hover:bg-blue-500 hover:text-white"
                            onClick={() => setIsAdminDropdownOpen(false)}
                          >
                            Timetable
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {user && user.role === 'teacher' && (
                  <>
                    <Link to="/teacher" className="hover:text-blue-200">Dashboard</Link>
                    <Link to="/teacher/timetable" className="hover:text-blue-200">My Timetable</Link>
                  </>
                )}

                {user && user.role === 'student' && (
                  <>
                    <Link to="/student" className="hover:text-blue-200">Dashboard</Link>
                    <Link to="/student/timetable" className="hover:text-blue-200">My Timetable</Link>
                  </>
                )}

                <div className="border-l border-blue-400 h-6 mx-2"></div>
                <span className="text-blue-200">{user?.name}</span>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/" className="hover:text-blue-200">Home</Link>
                <Link to="/login" className="hover:text-blue-200">Login</Link>
                <Link to="/register" className="bg-white text-blue-600 hover:bg-blue-100 px-4 py-2 rounded">Register</Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button onClick={toggleMenu} className="text-white focus:outline-none">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="mt-4 md:hidden">
            {isAuthenticated ? (
              <div className="flex flex-col space-y-2">
                <span className="text-blue-200 font-semibold">{user?.name}</span>
                <Link to="/" className="hover:text-blue-200" onClick={() => setIsMenuOpen(false)}>Home</Link>

                {user && user.role === 'admin' && (
                  <>
                    <div className="border-t border-blue-500 my-2 pt-2">
                      <div className="font-semibold text-blue-200 mb-1">Admin Menu</div>
                      <Link to="/admin" className="block py-1 hover:text-blue-200" onClick={() => setIsMenuOpen(false)}>Dashboard</Link>
                      <Link to="/admin/classes" className="block py-1 hover:text-blue-200" onClick={() => setIsMenuOpen(false)}>Classes</Link>
                      <Link to="/admin/subjects" className="block py-1 hover:text-blue-200" onClick={() => setIsMenuOpen(false)}>Subjects</Link>
                      <Link to="/admin/teachers" className="block py-1 hover:text-blue-200" onClick={() => setIsMenuOpen(false)}>Teachers</Link>
                      <Link to="/admin/timeslots" className="block py-1 hover:text-blue-200" onClick={() => setIsMenuOpen(false)}>Time Slots</Link>
                      <Link to="/admin/timetable" className="block py-1 hover:text-blue-200" onClick={() => setIsMenuOpen(false)}>Timetable</Link>
                    </div>
                  </>
                )}

                {user && user.role === 'teacher' && (
                  <>
                    <div className="border-t border-blue-500 my-2 pt-2">
                      <div className="font-semibold text-blue-200 mb-1">Teacher Menu</div>
                      <Link to="/teacher" className="block py-1 hover:text-blue-200" onClick={() => setIsMenuOpen(false)}>Dashboard</Link>
                      <Link to="/teacher/timetable" className="block py-1 hover:text-blue-200" onClick={() => setIsMenuOpen(false)}>My Timetable</Link>
                    </div>
                  </>
                )}

                {user && user.role === 'student' && (
                  <>
                    <div className="border-t border-blue-500 my-2 pt-2">
                      <div className="font-semibold text-blue-200 mb-1">Student Menu</div>
                      <Link to="/student" className="block py-1 hover:text-blue-200" onClick={() => setIsMenuOpen(false)}>Dashboard</Link>
                      <Link to="/student/timetable" className="block py-1 hover:text-blue-200" onClick={() => setIsMenuOpen(false)}>My Timetable</Link>
                    </div>
                  </>
                )}

                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded w-full text-center mt-2"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col space-y-2">
                <Link to="/" className="hover:text-blue-200" onClick={() => setIsMenuOpen(false)}>Home</Link>
                <Link to="/login" className="hover:text-blue-200" onClick={() => setIsMenuOpen(false)}>Login</Link>
                <Link to="/register" className="bg-white text-blue-600 hover:bg-blue-100 px-4 py-2 rounded text-center" onClick={() => setIsMenuOpen(false)}>Register</Link>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
