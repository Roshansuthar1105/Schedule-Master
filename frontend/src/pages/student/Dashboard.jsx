import { useContext } from 'react'
import { Link } from 'react-router-dom'
import AuthContext from '../../context/AuthContext'

const Dashboard = () => {
  const { user } = useContext(AuthContext)

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Student Dashboard</h1>
        <div className="text-gray-600">Welcome, {user?.name}</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">My Information</h2>
          <div className="space-y-2">
            <div>
              <span className="font-semibold">Name:</span> {user.name}
            </div>
            <div>
              <span className="font-semibold">Email:</span> {user.email}
            </div>
            {/* In a real application, we would show the student's class here */}
            <div>
              <span className="font-semibold">Class:</span> <span className="text-gray-500">Not assigned</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Quick Links</h2>
          <div className="space-y-2">
            <Link 
              to="/student/timetable" 
              className="block p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
            >
              <div className="font-semibold">View Timetable</div>
              <div className="text-sm text-gray-600">Check your class schedule</div>
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Class Timetable</h2>
          <Link 
            to="/student/timetable" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            View Full Timetable
          </Link>
        </div>
        <p className="text-gray-600">
          View your complete class schedule, including subjects and teachers.
        </p>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Note</h2>
        <p>
          In a real application, students would be assigned to specific classes, and would only see the timetable for their assigned class.
          For this demo, you can view timetables for any class.
        </p>
      </div>
    </div>
  )
}

export default Dashboard
