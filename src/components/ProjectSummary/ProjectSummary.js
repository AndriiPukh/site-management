import React from 'react'
import { useHistory } from 'react-router-dom'
import Avatar from '../Avatar/Avatar'
import { useFirestore } from '../../hooks/useFirestore'
import { useAuthContext } from '../../hooks/useAuthContext'

function ProjectSummary({ project }) {
  const { deleteDocument } = useFirestore('projects')
  const {
    user: { uid },
  } = useAuthContext()
  const history = useHistory()

  const handleClick = () => {
    deleteDocument(project.id)
    history.push('/')
  }
  return (
    <div className="project-summary">
      <h2 className="page-title">{project.name}</h2>
      <p>By {project.createdBy.displayName}</p>
      <p className="due-date">
        Project due by {project.dueDate.toDate().toDateString()}
      </p>
      <p className="details">{project.details}</p>
      <h4>Project is assigned to: </h4>
      <div className="assigned-users">
        {project.assignedUsersList.map((user) => (
          <div key={user.id}>
            <Avatar url={user.photoURL} />
          </div>
        ))}
      </div>
      {uid === project.createdBy.id && (
        <button type="button" className="btn" onClick={handleClick}>
          Mark as Complete
        </button>
      )}
    </div>
  )
}

export default ProjectSummary
