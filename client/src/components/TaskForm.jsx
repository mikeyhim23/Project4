import React, { useState, useEffect } from 'react';

const TaskForm = () => {
  const [taskId, setTaskId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('pending');
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState(null);
  
  // Hardcoded user_id since it's required by the backend
  const USER_ID = 1; 

  useEffect(() => {
    fetchTasks();
  }, [])

  const fetchTasks = () => {
    fetch('https://task-project-ci1o.onrender.com/task')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch tasks');
        }
        return response.json();
      })
      .then((data) => setTasks(data))
      .catch((error) => {
        console.error('Error fetching tasks:', error);
        setError('Failed to load tasks');
      });
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    // Validate inputs
    if (!title.trim() || !description.trim()) {
      setError('Title and description cannot be empty');
      return;
    }
    if (taskId) {
      handleUpdate(taskId);
    } else {
      handleAdd();
    }
  }

  const handleAdd = () => {
    const newTask = { 
      title, 
      description, 
      status, 
      user_id: USER_ID 
    }

    fetch('https://task-project-ci1o.onrender.com/task', {  
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newTask),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then(errorData => {
            throw new Error(errorData.message || 'Failed to add task');
          });
        }
        return response.json();
      })
      .then((data) => {
        // Update local state
        setTasks([...tasks, data]);
        
        // Reset form
        setTitle('');
        setDescription('');
        setStatus('pending');
      })
      .catch((error) => {
        console.error('Error adding task:', error);
        setError(error.message || 'Failed to add task');
      });
  }

  const handleUpdate = (id) => {
    const updatedTask = { 
      title, 
      description, 
      status, 
      user_id: USER_ID 
    };

    fetch(`https://task-project-ci1o.onrender.com/task/${id}`, {  
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedTask),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then(errorData => {
            throw new Error(errorData.message || 'Failed to update task');
          });
        }
        return response.json();
      })
      .then((data) => {
        // Update tasks array
        const updatedTasks = tasks.map((task) => 
          task.id === id ? data : task
        );
        
        setTasks(updatedTasks);
        
        // Reset form
        setTaskId('');
        setTitle('');
        setDescription('');
        setStatus('pending');
      })
      .catch((error) => {
        console.error('Error updating task:', error);
        setError(error.message || 'Failed to update task');
      });
  }

  const handleDelete = (id) => {
    fetch(`https://task-project-ci1o.onrender.com/task/${id}`, { 
      method: 'DELETE' 
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then(errorData => {
            throw new Error(errorData.message || 'Failed to delete task');
          });
        }
        return response.json();
      })
      .then(() => {
        setTasks(tasks.filter((task) => task.id !== id))
      })
      .catch((error) => {
        console.error('Error deleting task:', error);
        setError(error.message || 'Failed to delete task');
      });
  };

  const handleEdit = (task) => {
    setTaskId(task.id);
    setTitle(task.title);
    setDescription(task.description);
    setStatus(task.status);
  };

  return (
    <div>
      {error && <div style={{color: 'red'}}>{error}</div>}
      
      <h2>{taskId ? 'Edit Task' : 'Add Task'}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
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
        <button type="submit">{taskId ? 'Update Task' : 'Add Task'}</button>
        {taskId && (
          <button 
            type="button" 
            onClick={() => {
              setTaskId('');
              setTitle('');
              setDescription('');
              setStatus('pending');
            }}
          >
          </button>
        )}
      </form>

      <h3>Existing Tasks</h3>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            {task.title} - {task.status}
            <button onClick={() => handleDelete(task.id)}>Delete</button>
            <button onClick={() => handleEdit(task)}>Edit</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskForm;