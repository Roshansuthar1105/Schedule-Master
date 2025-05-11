import { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'

const SubjectList = () => {
  const [subjects, setSubjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: ''
  })
  const [editMode, setEditMode] = useState(false)
  const [currentId, setCurrentId] = useState(null)

  // Fetch subjects
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await axios.get('/subjects')
        setSubjects(res.data.data)
      } catch (err) {
        toast.error('Error fetching subjects')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchSubjects()
  }, [])

  const { name, code, description } = formData

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const resetForm = () => {
    setFormData({ name: '', code: '', description: '' })
    setEditMode(false)
    setCurrentId(null)
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    
    try {
      if (editMode) {
        // Update subject
        await axios.put(`/subjects/${currentId}`, formData)
        toast.success('Subject updated successfully')
      } else {
        // Create new subject
        await axios.post('/subjects', formData)
        toast.success('Subject created successfully')
      }
      
      // Refresh subject list
      const res = await axios.get('/subjects')
      setSubjects(res.data.data)
      
      // Reset form
      resetForm()
    } catch (err) {
      toast.error(err.response?.data?.error || 'Error saving subject')
    }
  }

  const handleEdit = (subject) => {
    setFormData({
      name: subject.name,
      code: subject.code,
      description: subject.description || ''
    })
    setEditMode(true)
    setCurrentId(subject._id)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this subject?')) {
      try {
        await axios.delete(`/subjects/${id}`)
        toast.success('Subject deleted successfully')
        
        // Update subject list
        setSubjects(subjects.filter(subject => subject._id !== id))
      } catch (err) {
        toast.error(err.response?.data?.error || 'Error deleting subject')
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
          <div className="p-4 bg-green-600 text-white">
            <h2 className="text-xl font-bold">Subjects</h2>
          </div>
          
          {subjects.length === 0 ? (
            <div className="p-4 text-center text-gray-500">No subjects found. Add a subject to get started.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {subjects.map(subject => (
                    <tr key={subject._id}>
                      <td className="px-6 py-4 whitespace-nowrap">{subject.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{subject.code}</td>
                      <td className="px-6 py-4">{subject.description || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleEdit(subject)}
                          className="text-indigo-600 hover:text-indigo-900 mr-4"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(subject._id)}
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
          <h2 className="text-xl font-bold mb-4">{editMode ? 'Edit Subject' : 'Add New Subject'}</h2>
          
          <form onSubmit={onSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                Subject Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={name}
                onChange={onChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Enter subject name"
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="code">
                Subject Code
              </label>
              <input
                type="text"
                id="code"
                name="code"
                value={code}
                onChange={onChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Enter subject code"
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                Description (Optional)
              </label>
              <textarea
                id="description"
                name="description"
                value={description}
                onChange={onChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Enter description"
                rows="3"
              ></textarea>
            </div>
            
            <div className="flex items-center justify-between">
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                {editMode ? 'Update Subject' : 'Add Subject'}
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

export default SubjectList
