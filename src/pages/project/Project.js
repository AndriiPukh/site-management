import React from 'react'
import './Project.css'
import { useParams } from 'react-router-dom'
import { useDocuments } from '../../hooks/useDocuments'
import ProjectSummary from '../../components/ProjectSummary/ProjectSummary'
import ProjectComments from '../../components/ProjectComments/ProjectComments'

function Project() {
  const { id } = useParams()
  const { document, error } = useDocuments('projects', id)

  if (error) {
    return <div className="error">{error}</div>
  }
  if (!document) {
    return <div>Loading...</div>
  }
  return (
    <div className="project-details">
      <ProjectSummary project={document} />
      <ProjectComments project={document} />
    </div>
  )
}

export default Project
