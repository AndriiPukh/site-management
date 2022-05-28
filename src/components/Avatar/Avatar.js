import React from 'react'
import './Avatar.css'

function Avatar({ url }) {
  return (
    <div className="avatar">
      <img src={url} alt="user avatar" />
    </div>
  )
}

export default Avatar
