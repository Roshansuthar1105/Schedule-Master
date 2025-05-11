import { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'

const TimeSlotList = () => {
  const [timeSlots, setTimeSlots] = useState([])
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    startTime: '',
    endTime: '',
    isBreak: false,
    breakName: '',
    order: 0
  })
  const [editMode, setEditMode] = useState(false)
  const [currentId, setCurrentId] = useState(null)

  // Fetch time slots
  useEffect(() => {
    const fetchTimeSlots = async () => {
      try {
        const res = await axios.get('/timeslots')
        setTimeSlots(res.data.data)
      } catch (err) {
        toast.error('Error fetching time slots')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchTimeSlots()
  }, [])

  const { startTime, endTime, isBreak, breakName, order } = formData

  const onChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setFormData({ ...formData, [e.target.name]: value })
  }

  const resetForm = () => {
    setFormData({
      startTime: '',
      endTime: '',
      isBreak: false,
      breakName: '',
      order: timeSlots.length > 0 ? Math.max(...timeSlots.map(slot => slot.order)) + 1 : 1
    })
    setEditMode(false)
    setCurrentId(null)
  }

  // Set initial order value
  useEffect(() => {
    if (timeSlots.length > 0 && !editMode) {
      setFormData(prev => ({
        ...prev,
        order: Math.max(...timeSlots.map(slot => slot.order)) + 1
      }))
    }
  }, [timeSlots, editMode])

  const onSubmit = async (e) => {
    e.preventDefault()
    
    try {
      if (editMode) {
        // Update time slot
        await axios.put(`/timeslots/${currentId}`, formData)
        toast.success('Time slot updated successfully')
      } else {
        // Create new time slot
        await axios.post('/timeslots', formData)
        toast.success('Time slot created successfully')
      }
      
      // Refresh time slot list
      const res = await axios.get('/timeslots')
      setTimeSlots(res.data.data)
      
      // Reset form
      resetForm()
    } catch (err) {
      toast.error(err.response?.data?.error || 'Error saving time slot')
    }
  }

  const handleEdit = (timeSlot) => {
    setFormData({
      startTime: timeSlot.startTime,
      endTime: timeSlot.endTime,
      isBreak: timeSlot.isBreak,
      breakName: timeSlot.breakName || '',
      order: timeSlot.order
    })
    setEditMode(true)
    setCurrentId(timeSlot._id)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this time slot?')) {
      try {
        await axios.delete(`/timeslots/${id}`)
        toast.success('Time slot deleted successfully')
        
        // Update time slot list
        setTimeSlots(timeSlots.filter(timeSlot => timeSlot._id !== id))
      } catch (err) {
        toast.error(err.response?.data?.error || 'Error deleting time slot')
      }
    }
  }

  if (loading) {
    return <div className="text-center py-10">Loading...</div>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-4 bg-yellow-600 text-white">
            <h2 className="text-xl font-bold">Time Slots</h2>
          </div>
          
          {timeSlots.length === 0 ? (
            <div className="p-4 text-center text-gray-500">No time slots found. Add a time slot to get started.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {timeSlots
                    .sort((a, b) => a.order - b.order)
                    .map(timeSlot => (
                      <tr key={timeSlot._id}>
                        <td className="px-6 py-4 whitespace-nowrap">{timeSlot.order}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{timeSlot.startTime}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{timeSlot.endTime}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {timeSlot.isBreak ? (
                            <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full">
                              Break: {timeSlot.breakName || 'Unnamed'}
                            </span>
                          ) : (
                            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full">
                              Class Period
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleEdit(timeSlot)}
                            className="text-indigo-600 hover:text-indigo-900 mr-4"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(timeSlot._id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      
      <div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">{editMode ? 'Edit Time Slot' : 'Add New Time Slot'}</h2>
          
          <form onSubmit={onSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="startTime">
                Start Time
              </label>
              <input
                type="time"
                id="startTime"
                name="startTime"
                value={startTime}
                onChange={onChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="endTime">
                End Time
              </label>
              <input
                type="time"
                id="endTime"
                name="endTime"
                value={endTime}
                onChange={onChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="order">
                Order
              </label>
              <input
                type="number"
                id="order"
                name="order"
                value={order}
                onChange={onChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                min="1"
                required
              />
              <p className="text-gray-500 text-xs italic mt-1">
                Determines the order of time slots in the timetable
              </p>
            </div>
            
            <div className="mb-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  id="isBreak"
                  name="isBreak"
                  checked={isBreak}
                  onChange={onChange}
                  className="form-checkbox h-5 w-5 text-yellow-600"
                />
                <span className="ml-2 text-gray-700">This is a break period</span>
              </label>
            </div>
            
            {isBreak && (
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="breakName">
                  Break Name
                </label>
                <input
                  type="text"
                  id="breakName"
                  name="breakName"
                  value={breakName}
                  onChange={onChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="e.g., Lunch, Recess"
                />
              </div>
            )}
            
            <div className="flex items-center justify-between">
              <button
                type="submit"
                className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                {editMode ? 'Update Time Slot' : 'Add Time Slot'}
              </button>
              
              {editMode && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default TimeSlotList
