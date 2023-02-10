import React, { useEffect, useState } from 'react'
import './Create.css'
import Select from 'react-select'
import { useNavigate } from 'react-router-dom'
import { useCollection } from '../../hooks/useCollection'
import { timestamp } from '../../firebase/config'
import { useAuthContext } from '../../hooks/useAuthContext'
import { useFirestore } from '../../hooks/useFirestore'

const CATEGORIES = [
  { value: 'development', label: 'Development' },
  { value: 'design', label: 'Design' },
  { value: 'sales', label: 'Sales' },
  { value: 'marketing', label: 'Marketing' },
]

function Create() {
  const navigate = useNavigate()
  const { documents } = useCollection('users')
  const [users, setUsers] = useState([])
  const { user } = useAuthContext()
  const { addDocument, response } = useFirestore('projects')
  // form field values
  const [name, setName] = useState('')
  const [details, setDetails] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [category, setCategory] = useState('')
  const [assignedUsers, setAssignedUsers] = useState([])
  const [formError, setFormError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError(null)
    if (!category) {
      setFormError('Please select a project category')
      return
    }
    if (assignedUsers.length < 1) {
      setFormError('Please select the project to at list 1 user')
      return
    }

    const createdBy = {
      displayName: user.displayName,
      photoURL: user.photoURL,
      id: user.uid,
    }
    const assignedUsersList = assignedUsers.map((u) => ({
      displayName: u.value.displayName,
      photoURL: u.value.photoURL,
      id: u.value.id,
    }))

    const project = {
      name,
      details,
      category: category.value,
      dueDate: timestamp.fromDate(new Date(dueDate)),
      comments: [],
      createdBy,
      assignedUsersList,
    }

    await addDocument(project)
    if (!response.error) {
      navigate('/')
    }
  }

  useEffect(() => {
    if (documents) {
      const options = documents.map((u) => ({
        value: u,
        label: u.displayName,
      }))
      setUsers(options)
    }
  }, [documents])

  return (
    <div className="create-form">
      <h2 className="page-title">Create a new project</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="projectName">
          <span>Project name:</span>
          <input
            required
            type="text"
            id="projectName"
            onChange={(e) => setName(e.target.value)}
            value={name}
          />
        </label>
        <label htmlFor="projectDetails">
          <span>Project details:</span>
          <textarea
            required
            id="projectDetails"
            onChange={(e) => setDetails(e.target.value)}
            value={details}
          />
        </label>
        <label htmlFor="projectDetails">
          <span>Set due date:</span>
          <input
            required
            type="date"
            id="dueDate"
            onChange={(e) => setDueDate(e.target.value)}
            value={dueDate}
          />
        </label>
        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
        <label htmlFor="category">
          <span>Project category:</span>
          <Select
            options={CATEGORIES}
            onChange={(option) => setCategory(option)}
          />
        </label>
        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
        <label htmlFor="assign">
          <span>Assign to:</span>
          <Select
            options={users}
            onChange={(option) => setAssignedUsers(option)}
            isMulti
          />
        </label>
        <button type="submit" className="btn">
          Add Project
        </button>
        {formError && <p className="error">{formError}</p>}
      </form>
    </div>
  )
}

export default Create
