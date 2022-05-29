import React from 'react'

const filterList = [
  'all',
  'mine',
  'development',
  'design',
  'marketing',
  'sales',
]

function ProjectFilter({ currentFilter, changeFilter }) {
  const handleClick = (newFilter) => {
    changeFilter(newFilter)
  }
  return (
    <div className="project-filter">
      <nav>
        {filterList.map((f) => (
          <button
            type="button"
            className={currentFilter === f ? 'active' : ''}
            key={f}
            onClick={() => handleClick(f)}
          >
            {f}
          </button>
        ))}
      </nav>
    </div>
  )
}

export default ProjectFilter
