import React, { useState } from 'react'

const ProjectForm = ({ onProjectAdd }) => {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!name) {
      setError('Project name is required')
      return
    }

    setError('')

    const newProject = { name, description }

    fetch('/project', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProject),
    })
      .then((response) => response.json())
      .then((data) => {
        onProjectAdd(data)
        setName('')
        setDescription('')
      })
      .catch((error) => console.error('Error adding project:', error))
  }

  return (
    <div>
      <h2>Add Project</h2>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Project Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <button type="submit">Add Project</button>
      </form>
    </div>
  )
}

export default ProjectForm
