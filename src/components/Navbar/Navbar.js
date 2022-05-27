import React from 'react'
import { Link } from 'react-router-dom'
// styles & images
import './Navbar.css'
import Temple from '../../assets/temple.svg'
import { useLogout } from '../../hooks/useLogout'

function Navbar() {
  const { logout, isPending } = useLogout()
  return (
    <div className="navbar">
      <ul>
        <li className="logo">
          <img src={Temple} alt="dojo logo" />
          <span> The Dojo </span>
        </li>
        <li>
          <Link to="/login">Login</Link>
        </li>
        <li>
          <Link to="/signup">Signup</Link>
        </li>
        <li>
          {isPending && (
            <button className="btn" type="button" disabled>
              Loading...
            </button>
          )}
          {!isPending && (
            <button className="btn" type="button" onClick={logout}>
              Logout
            </button>
          )}
        </li>
      </ul>
    </div>
  )
}

export default Navbar
