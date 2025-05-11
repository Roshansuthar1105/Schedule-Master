import { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'

const TimetableManagement = () => {
  const [classes, setClasses] = useState([])
  const [selectedClass, setSelectedClass] = useState('')
  const [days, setDays] = useState(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'])
  const [timeSlots, setTimeSlots] = useState([])
  const [timetable, setTimetable] = useState([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)

  // Fetch classes and time slots
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [classesRes, timeSlotsRes] = await Promise.all([
          axios.get('/classes'),
          axios.get('/timeslots')
        ])
        
        setClasses(classesRes.data.data)
        setTimeSlots(timeSlotsRes.data.data.sort((a, b) => a.order - b.order))
        
        if (classesRes.data.data.length > 0) {
          setSelectedClass(classesRes.data.data[0]._id)
        }
      } catch (err) {
        toast.error('Error fetching data')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Fetch timetable for selected class
  useEffect(() => {
    const fetchTimetable = async () => {
      if (!selectedClass) return
      
      try {
        setLoading(true)
        const res = await axios.get(`/timetables/class/${selectedClass}`)
        setTimetable(res.data.data)
      } catch (err) {
        toast.error('Error fetching timetable')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchTimetable()
  }, [selectedClass])

  const handleClassChange = (e) => {
    setSelectedClass(e.target.value)
  }

  const generateTimetable = async () => {
    try {
      setGenerating(true)
      const res = await axios.post('/generator/generate')
      
      if (res.data.success) {
        toast.success('Timetable generated successfully')
        
        // Refresh timetable for selected class
        const timetableRes = await axios.get(`/timetables/class/${selectedClass}`)
        setTimetable(timetableRes.data.data)
      } else {
        toast.error('Error generating timetable')
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Error generating timetable')
    } finally {
      setGenerating(false)
    }
  }

  // Get timetable entry for a specific day and time slot
  const getTimetableEntry = (day, timeSlotId) => {
    return timetable.find(entry => 
      entry.day === day && 
      entry.timeSlot._id === timeSlotId
    )
  }

  if (loading && classes.length === 0) {
    return <div className="text-center py-10">Loading...</div>
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-3xl font-bold mb-4 md:mb-0">Timetable Management</h1>
        
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
          <select
            value={selectedClass}
            onChange={handleClassChange}
            className="border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            {classes.map(cls => (
              <option key={cls._id} value={cls._id}>
                {cls.name} {cls.section ? `(${cls.section})` : ''}
              </option>
            ))}
          </select>
          
          <button
            onClick={generateTimetable}
            disabled={generating || classes.length === 0}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            {generating ? 'Generating...' : 'Generate Timetable'}
          </button>
        </div>
      </div>
      
      {classes.length === 0 ? (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6">
          <p className="font-bold">No classes found</p>
          <p>Please add classes, subjects, teachers, and time slots before generating a timetable.</p>
        </div>
      ) : timeSlots.length === 0 ? (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6">
          <p className="font-bold">No time slots found</p>
          <p>Please add time slots before generating a timetable.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
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
                          {loading ? (
                            <div className="animate-pulse h-6 bg-gray-200 rounded"></div>
                          ) : entry ? (
                            entry.isBreak ? (
                              <div className="bg-gray-100 p-2 rounded text-center">
                                <span className="font-medium">{entry.breakName || 'Break'}</span>
                              </div>
                            ) : (
                              <div className="bg-blue-50 p-2 rounded">
                                <div className="font-medium">{entry.subject?.name || 'No Subject'}</div>
                                <div className="text-sm text-gray-600">
                                  {entry.teacher?.user?.name || 'No Teacher'}
                                </div>
                                {entry.room && (
                                  <div className="text-xs text-gray-500">Room: {entry.room}</div>
                                )}
                              </div>
                            )
                          ) : (
                            <div className="text-gray-400 italic">Not assigned</div>
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
      )}
      
      <div className="mt-6 bg-blue-50 p-4 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Instructions</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>Select a class from the dropdown to view its timetable.</li>
          <li>Click "Generate Timetable" to create a new timetable for all classes.</li>
          <li>The timetable generator will automatically assign teachers and subjects based on availability.</li>
          <li>Make sure you have added classes, subjects, teachers, and time slots before generating a timetable.</li>
          <li>The generator will respect teacher constraints and avoid scheduling conflicts.</li>
        </ul>
      </div>
    </div>
  )
}

export default TimetableManagement
