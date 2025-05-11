import { useContext, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import AuthContext from '../../context/AuthContext'

const Dashboard = () => {
  const { user } = useContext(AuthContext)
  const [teacherData, setTeacherData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTeacherData = async () => {
      try {
        // Find teacher profile by user ID
        const res = await axios.get('/teachers')
        const teacher = res.data.data.find(t => t.user._id === user.id)
        
        if (teacher) {
          setTeacherData(teacher)
        }
      } catch (err) {
        console.error('Error fetching teacher data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchTeacherData()
  }, [user.id])

  if (loading) {
    return <div className="text-center py-10">Loading...</div>
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Teacher Dashboard</h1>
        <div className="text-gray-600">Welcome, {user?.name}</div>
      </div>

      {!teacherData ? (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6">
          <p className="font-bold">Teacher profile not found</p>
          <p>Please contact an administrator to set up your teacher profile.</p>
        </div>
      ) : (
        <>
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
                <div>
                  <span className="font-semibold">Max Hours Per Day:</span> {teacherData.maxHoursPerDay}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">My Subjects</h2>
              {teacherData.subjects.length === 0 ? (
                <p className="text-gray-500">No subjects assigned yet.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {teacherData.subjects.map(subject => (
                    <span key={subject._id} className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full">
                      {subject.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">My Timetable</h2>
              <Link 
                to="/teacher/timetable" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
              >
                View Full Timetable
              </Link>
            </div>
            <p className="text-gray-600">
              View your complete teaching schedule, including class assignments and timings.
            </p>
          </div>
        </>
      )}
    </div>
  )
}

export default Dashboard
