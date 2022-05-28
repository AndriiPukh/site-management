import React from 'react'
// styles & images
import './Sidebar.css'
import { NavLink } from 'react-router-dom'
import DashboardIcon from '../../assets/dashboard_icon.svg'
import AddIcon from '../../assets/add_icon.svg'
import Avatar from '../Avatar/Avatar'
import { useAuthContext } from '../../hooks/useAuthContext'

function Sidebar() {
  const { user } = useAuthContext()
  return (
    <div className="sidebar">
      <div className="sidebar-content">
        {user && (
          <div className="user">
            <Avatar url={user.photoURL} />
            <p>Hey {user.displayName}</p>
          </div>
        )}
        <div className="links">
          <ul>
            <li>
              <NavLink exact to="/">
                <img src={DashboardIcon} alt="dashboard icon" />
                <span>Dashboard</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/create">
                <img src={AddIcon} alt="add icon" />
                <span>New Project</span>
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
