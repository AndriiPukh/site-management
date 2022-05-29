import React, { useState } from 'react'
import './Dashboard.css'
import { useCollection } from '../../hooks/useCollection'
import ProjectList from '../../components/ProjectList/ProjectList'
import ProjectFilter from '../../components/ProjectFilter/ProjectFilter'
import { useAuthContext } from '../../hooks/useAuthContext'

function Dashboard() {
  const { documents, error } = useCollection('projects')
  const {
    user: { uid },
  } = useAuthContext()
  const [currentFilter, setCurrentFilter] = useState('all')
  const changeFilter = (newFilter) => {
    setCurrentFilter(newFilter)
  }

  const filter =
    documents &&
    documents.filter((project) => {
      switch (currentFilter) {
        case 'all':
          return true
        case 'mine':
          // eslint-disable-next-line no-case-declarations
          let assignedToMe = false
          project.assignedUsersList.forEach((u) => {
            if (u.id === uid) {
              assignedToMe = true
            }
          })
          return assignedToMe
        case 'development':
        case 'design':
        case 'marketing':
        case 'sales':
          return project.category === currentFilter
        default:
          return true
      }
    })

  const projects = documents ? filter : null

  return (
    <div>
      <h2 className="title">Dashboard</h2>
      {error && <p className="error">{error}</p>}
      {projects && (
        <ProjectFilter
          currentFilter={currentFilter}
          changeFilter={changeFilter}
        />
      )}
      {projects && <ProjectList projects={projects} />}
    </div>
  )
}

export default Dashboard
