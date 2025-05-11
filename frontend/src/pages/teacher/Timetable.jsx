import { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import AuthContext from '../../context/AuthContext'

const Timetable = () => {
  const { user } = useContext(AuthContext)
  const [teacherData, setTeacherData] = useState(null)
  const [timetable, setTimetable] = useState([])
  const [timeSlots, setTimeSlots] = useState([])
  const [days] = useState(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Find teacher profile by user ID
        const teachersRes = await axios.get('/teachers')
        const teacher = teachersRes.data.data.find(t => t.user._id === user.id)
        
        if (teacher) {
          setTeacherData(teacher)
          
          // Fetch timetable for this teacher
          const [timetableRes, timeSlotsRes] = await Promise.all([
            axios.get(`/timetables/teacher/${teacher._id}`),
            axios.get('/timeslots')
          ])
          
          setTimetable(timetableRes.data.data)
          setTimeSlots(timeSlotsRes.data.data.sort((a, b) => a.order - b.order))
        } else {
          toast.error('Teacher profile not found')
        }
      } catch (err) {
        toast.error('Error fetching timetable')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user.id])

  // Get timetable entry for a specific day and time slot
  const getTimetableEntry = (day, timeSlotId) => {
    return timetable.find(entry => 
      entry.day === day && 
      entry.timeSlot._id === timeSlotId
    )
  }

  if (loading) {
    return <div className="text-center py-10">Loading...</div>
  }

  if (!teacherData) {
    return (
      <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4">
        <p className="font-bold">Teacher profile not found</p>
        <p>Please contact an administrator to set up your teacher profile.</p>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">My Timetable</h1>
        <p className="text-gray-600">
          Viewing teaching schedule for {user.name}
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                {days.map(day => (
                  <th key={day} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {timeSlots.map(timeSlot => (
                <tr key={timeSlot._id}>
                  <td className="px-6 py-4 whitespace-nowrap font-medium">
                    {timeSlot.startTime} - {timeSlot.endTime}
                    {timeSlot.isBreak && (
                      <div className="text-xs text-gray-500">{timeSlot.breakName || 'Break'}</div>
                    )}
                  </td>
                  
                  {days.map(day => {
                    const entry = getTimetableEntry(day, timeSlot._id)
                    
                    return (
                      <td key={`${day}-${timeSlot._id}`} className="px-6 py-4">
                        {timeSlot.isBreak ? (
                          <div className="bg-gray-100 p-2 rounded text-center">
                            <span className="font-medium">{timeSlot.breakName || 'Break'}</span>
                          </div>
                        ) : entry ? (
                          <div className="bg-blue-50 p-2 rounded">
                            <div className="font-medium">{entry.subject?.name || 'No Subject'}</div>
                            <div className="text-sm text-gray-600">
                              Class: {entry.class?.name} {entry.class?.section ? `(${entry.class.section})` : ''}
                            </div>
                            {entry.room && (
                              <div className="text-xs text-gray-500">Room: {entry.room}</div>
                            )}
                          </div>
                        ) : (
                          <div className="text-gray-400 italic">Free Period</div>
                        )}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Legend</h2>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-blue-50 border border-blue-200 rounded mr-2"></div>
            <span>Class Period</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-gray-100 border border-gray-200 rounded mr-2"></div>
            <span>Break</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-white border border-gray-200 rounded mr-2"></div>
            <span>Free Period</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Timetable
