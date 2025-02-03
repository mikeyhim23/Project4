import React, { useState, useEffect } from 'react'

const ProjectForm = ({ onProjectSave, existingProject }) => {
  const [name, setName] = useState(existingProject?.name || '')
  const [description, setDescription] = useState(existingProject?.description || '')
  const [error, setError] = useState('')

  useEffect(() => {
    if (existingProject) {
      setName(existingProject.name)
      setDescription(existingProject.description)
    }
  }, [existingProject])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name) {
      setError('Project name is required')
      return
    }
    setError('')

    const projectData = { name, description }

    if (existingProject) {
      // Update existing project
      fetch(`https://task-project-ci1o.onrender.com/project/${existingProject.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectData),
      })
        .then((response) => response.json())
        .then(onProjectSave)  
        .catch((error) => console.error('Error updating project:', error))
    } else {
      // Add new project
      fetch('https://task-project-ci1o.onrender.com/project', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectData),
      })
        .then((response) => response.json())
        .then(onProjectSave) 
        .catch((error) => console.error('Error adding project:', error))
    }
  }

  return (
    <div>
      <h2>{existingProject ? 'Edit Project' : 'Add Project'}</h2>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Project Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <button type="submit">{existingProject ? 'Save Changes' : 'Add Project'}</button>
      </form>
    </div>
  )
}

export default ProjectForm
