import React, { useState, useEffect } from 'react';
import TaskForm from '../components/TaskForm';

const Task = () => {
  const [tasks, setTasks] = useState([])

  useEffect(() => {
    fetch('https://task-project-ci1o.onrender.com/task') 
      .then((response) => response.json())
      .then((data) => setTasks(data))
      .catch((error) => console.error('Error fetching tasks:', error))
  }, [])

  const handleTaskAdd = (task) => {
    setTasks([...tasks, task])
  }

  const handleTaskUpdate = (task) => {
    setTasks(tasks.map((t) => (t.id === task.id ? task : t)))
  }

  const handleTaskDelete = (task) => {
    setTasks(tasks.filter((t) => t.id !== task.id))
  }

  return (
    <div>
      <h2>Manage Tasks</h2>
      <TaskForm
        onTaskAdd={handleTaskAdd}
        onTaskUpdate={handleTaskUpdate}
        onTaskDelete={handleTaskDelete}
      />
      <h3>Tasks</h3>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            {task.title} - {task.status}
            <button onClick={() => handleTaskDelete(task)}>Delete</button>
            <button onClick={() => handleTaskUpdate(task)}>Update</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Task;