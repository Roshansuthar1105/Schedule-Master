import { useContext } from 'react'
import { Link } from 'react-router-dom'
import AuthContext from '../context/AuthContext'

const Home = () => {
  const { isAuthenticated, user } = useContext(AuthContext)

  return (
    <div className="flex flex-col items-center">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-blue-600">Welcome to Schedule Master</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          A comprehensive timetable management system for schools and educational institutions.
        </p>
      </div>

      {isAuthenticated ? (
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Welcome back, {user.name}!</h2>
          
          {user.role === 'admin' && (
            <div>
              <p className="mb-4">As an administrator, you can manage classes, subjects, teachers, and timetables.</p>
              <Link 
                to="/admin" 
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg inline-block"
              >
                Go to Admin Dashboard
              </Link>
            </div>
          )}
          
          {user.role === 'teacher' && (
            <div>
              <p className="mb-4">As a teacher, you can view your teaching schedule.</p>
              <Link 
                to="/teacher/timetable" 
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg inline-block"
              >
                View My Timetable
              </Link>
            </div>
          )}
          
          {user.role === 'student' && (
            <div>
              <p className="mb-4">As a student, you can view your class timetable.</p>
              <Link 
                to="/student/timetable" 
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg inline-block"
              >
                View Class Timetable
              </Link>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-2 text-blue-600">For Administrators</h3>
              <p className="text-gray-600 mb-4">Create and manage timetables, assign teachers, and organize classes efficiently.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-2 text-blue-600">For Teachers</h3>
              <p className="text-gray-600 mb-4">View your teaching schedule, check assignments, and manage your classes.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-2 text-blue-600">For Students</h3>
              <p className="text-gray-600 mb-4">Access your class timetable anytime, anywhere with our user-friendly interface.</p>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <Link 
              to="/login" 
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg"
            >
              Login
            </Link>
            <Link 
              to="/register" 
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-6 rounded-lg"
            >
              Register
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

export default Home
