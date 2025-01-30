import React, { useState, useEffect } from 'react'
import TaskForm from '../components/TaskForm'

const Tasks = () => {
  const [tasks, setTasks] = useState([])

  useEffect(() => {
    fetch('/task')
      .then((response) => response.json())
      .then((data) => setTasks(data))
      .catch((error) => console.error('Error fetching tasks:', error))
  }, [])

  const handleTaskAdd = (task) => {
    setTasks([...tasks, task])
  }

  return (
    <div>
      <TaskForm onTaskAdd={handleTaskAdd} />
      <h3>Existing Tasks</h3>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>{task.title} - {task.status}</li>
        ))}
      </ul>
    </div>
  )
}

export default Tasks
