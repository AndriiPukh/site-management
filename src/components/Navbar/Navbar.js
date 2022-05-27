import React from 'react'
import { Link } from 'react-router-dom'
// styles & images
import './Navbar.css'
import Temple from '../../assets/temple.svg'
import { useLogout } from '../../hooks/useLogout'
import { useAuthContext } from '../../hooks/useAuthContext'

function Navbar() {
  const { logout, isPending } = useLogout()
  const { user } = useAuthContext()
  return (
    <div className="navbar">
      <ul>
        <li className="logo">
          <img src={Temple} alt="dojo logo" />
          <span> The Dojo </span>
        </li>
        {!user && (
          <>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/signup">Signup</Link>
            </li>
          </>
        )}
        {user && (
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
        )}
      </ul>
    </div>
  )
}

export default Navbar
