import React, { useState, useEffect } from 'react'
import ProjectForm from '../components/ProjectForm'

const Projects = () => {
  const [projects, setProjects] = useState([])

  useEffect(() => {
    fetch('/project')
      .then((response) => response.json())
      .then((data) => setProjects(data))
      .catch((error) => console.error('Error fetching projects:', error))
  }, [])

  const handleProjectAdd = (project) => {
    setProjects([...projects, project])
  }

  return (
    <div>
      <ProjectForm onProjectAdd={handleProjectAdd} />
      <h3>Existing Projects</h3>
      <ul>
        {projects.map((project) => (
          <li key={project.id}>{project.name} - {project.description}</li>
        ))}
      </ul>
    </div>
  )
}

export default Projects
