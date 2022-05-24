import React from 'react'
// styles & images
import './Sidebar.css'
import { NavLink } from 'react-router-dom'
import DashboardIcon from '../../assets/dashboard_icon.svg'
import AddIcon from '../../assets/add_icon.svg'

function Sidebar() {
  return (
    <div className="sidebar">
      <div className="sidebar-content">
        <div className="user">
          {/* avatar and user here later */}
          <p>Hey user</p>
        </div>
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
