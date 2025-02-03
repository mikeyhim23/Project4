import React, { useState, useEffect } from 'react';

const UserTaskForm = ({ onUserTaskAdd, onUserTaskEdit, onUserTaskDelete }) => {
  const [userTaskId, setUserTaskId] = useState('');
  const [userId, setUserId] = useState('');
  const [projectId, setProjectId] = useState('');
  const [role, setRole] = useState('');
  const [error, setError] = useState('');
  const [userTasks, setUserTasks] = useState([]);

  useEffect(() => {
    fetch('https://task-project-ci1o.onrender.com/user_task')
      .then((response) => response.json())
      .then((data) => setUserTasks(data))
      .catch((error) => console.error('Error fetching user tasks:', error))
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!userId || !projectId || !role) {
      setError('Please fill in all fields')
      return
    }

    const newUserTask = { user_id: userId, project_id: projectId, role }

    if (userTaskId) {
      fetch(`https://task-project-ci1o.onrender.com/user_task/${userTaskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUserTask),
      })
        .then((response) => response.json())
        .then((data) => {
          onUserTaskEdit(data)
          setUserTaskId('')
          setUserId('')
          setProjectId('')
          setRole('')
        })
        .catch((error) => setError('Error updating user task: ' + error.message))
    } else {
      fetch('https://task-project-ci1o.onrender.com/user_task', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUserTask),
      })
        .then((response) => response.json())
        .then((data) => {
          onUserTaskAdd(data)
          setUserId('')
          setProjectId('')
          setRole('')
        })
        .catch((error) => setError('Error adding user task: ' + error.message))
    }
  }

  const handleDelete = (id) => {
    fetch(`https://task-project-ci1o.onrender.com/user_task/${id}`, { method: 'DELETE' })
      .then((response) => response.json())
      .then(() => {
        onUserTaskDelete(id)
      })
      .catch((error) => {
        console.error('Error deleting user task:', error)
        setError('Error deleting user task: ' + error.message)
      })
  }

  const handleEdit = (task) => {
    // Pre-fill the form
    setUserTaskId(task.id);
    setUserId(task.user_id);
    setProjectId(task.project_id);
    setRole(task.role);
  };

  return (
    <div>
      <h2>{userTaskId ? 'Edit' : 'Assign'} User Task</h2>
      {error && <div styleKKK={{ color: 'red' }}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="userId">User ID</label>
          <input
            type="text"
            id="userId"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="projectId">Project ID</label>
          <input
            type="text"
            id="projectId"
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="role">Role</label>
          <input
            type="text"
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          />
        </div>
        <button type="submit">{userTaskId ? 'Update Task' : 'Assign Task'}</button>
      </form>

      <h3>Existing User Tasks</h3>
      <ul>
        {userTasks.map((task) => (
          <li key={task.id}>
            User ID: {task.user_id}, Project ID: {task.project_id}, Role: {task.role}
            <button onClick={() => handleEdit(task)}>Edit</button>
            <button onClick={() => handleDelete(task.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default UserTaskForm;
