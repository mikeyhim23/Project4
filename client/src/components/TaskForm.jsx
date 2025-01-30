import React, { useState } from 'react';

const TaskForm = ({ onTaskAdd }) => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState('pending')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title || !description) {
      setError('Title and description are required');
      return;
    }
    setError('')

    const newTask = { title, description, status, user_id: 1 };

    fetch('/task', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTask),
    })
      .then((response) => response.json())
      .then((data) => {
        onTaskAdd(data)
        setTitle('');
        setDescription('')
        setStatus('pending')
      })
      .catch((error) => console.error('Error adding task:', error))
  };

  return (
    <div>
      <h2>Add Task</h2>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
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
        <div>
          <label htmlFor="status">Status</label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <button type="submit">Add Task</button>
      </form>
    </div>
  );
};

export default TaskForm;
