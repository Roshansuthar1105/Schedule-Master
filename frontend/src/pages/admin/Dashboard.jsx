import { useContext, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import AuthContext from '../../context/AuthContext'

const Dashboard = () => {
  const { user } = useContext(AuthContext)
  const [stats, setStats] = useState({
    classes: 0,
    subjects: 0,
    teachers: 0,
    students: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch counts from API
        const [classesRes, subjectsRes, teachersRes] = await Promise.all([
          axios.get('/classes'),
          axios.get('/subjects'),
          axios.get('/teachers')
        ])

        setStats({
          classes: classesRes.data.count || 0,
          subjects: subjectsRes.data.count || 0,
          teachers: teachersRes.data.count || 0,
          students: 0 // We'll implement this later
        })
      } catch (err) {
        console.error('Error fetching stats:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const cards = [
    {
      title: 'Classes',
      count: stats.classes,
      icon: '🏫',
      link: '/admin/classes',
      color: 'bg-blue-500'
    },
    {
      title: 'Subjects',
      count: stats.subjects,
      icon: '📚',
      link: '/admin/subjects',
      color: 'bg-green-500'
    },
    {
      title: 'Teachers',
      count: stats.teachers,
      icon: '👨‍🏫',
      link: '/admin/teachers',
      color: 'bg-purple-500'
    },
    {
      title: 'Time Slots',
      count: '⏰',
      icon: '⏰',
      link: '/admin/timeslots',
      color: 'bg-yellow-500'
    },
    {
      title: 'Timetable',
      count: '📅',
      icon: '📅',
      link: '/admin/timetable',
      color: 'bg-red-500'
    }
  ]

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="text-gray-600">Welcome, {user?.name}</div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-xl">Loading...</div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {cards.map((card, index) => (
              <Link
                key={index}
                to={card.link}
                className={`${card.color} text-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300`}
              >
                <div className="p-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-2xl font-bold mb-2">{card.title}</h2>
                      <p className="text-4xl font-bold">{card.count}</p>
                    </div>
                    <div className="text-5xl">{card.icon}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Link
                to="/admin/classes"
                className="bg-blue-100 text-blue-700 p-4 rounded-lg hover:bg-blue-200 transition-colors duration-300"
              >
                Manage Classes
              </Link>
              <Link
                to="/admin/subjects"
                className="bg-green-100 text-green-700 p-4 rounded-lg hover:bg-green-200 transition-colors duration-300"
              >
                Manage Subjects
              </Link>
              <Link
                to="/admin/teachers"
                className="bg-purple-100 text-purple-700 p-4 rounded-lg hover:bg-purple-200 transition-colors duration-300"
              >
                Manage Teachers
              </Link>
              <Link
                to="/admin/timeslots"
                className="bg-yellow-100 text-yellow-700 p-4 rounded-lg hover:bg-yellow-200 transition-colors duration-300"
              >
                Manage Time Slots
              </Link>
              <Link
                to="/admin/timetable"
                className="bg-red-100 text-red-700 p-4 rounded-lg hover:bg-red-200 transition-colors duration-300"
              >
                Generate Timetable
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default Dashboard
