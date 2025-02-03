import React, { useState, useEffect } from 'react';
import UserTaskForm from '../components/UserTaskForm';

const UserTask = () => {
  const [userTasks, setUserTasks] = useState([])

  useEffect(() => {
    fetch('https://task-project-ci1o.onrender.com/user_task')
      .then((response) => response.json())
      .then((data) => setUserTasks(data))
      .catch((error) => console.error('Error fetching user tasks:', error))
  }, [])

  const handleUserTaskAdd = (userTask) => {
    setUserTasks([...userTasks, userTask])
  }

  const handleUserTaskDelete = (id) => {
    setUserTasks(userTasks.filter((task) => task.id !== id))
  }

  const handleUserTaskEdit = (updatedTask) => {
    setUserTasks(
      userTasks.map((task) =>
        task.id === updatedTask.id ? { ...task, updatedTask } : task
      )
    )
  }

  return (
    <div>
      <h2>Manage User Tasks</h2>
      <UserTaskForm
        onUserTaskAdd={handleUserTaskAdd}
        onUserTaskDelete={handleUserTaskDelete}
        onUserTaskEdit={handleUserTaskEdit}
      />
      <h3>User Tasks</h3>
      <ul>
        {userTasks.map((userTask) => (
          <li key={userTask.id}>
            User ID: {userTask.user_id}, Project ID: {userTask.project_id}, Role: {userTask.role}
            <button onClick={() => handleUserTaskDelete(userTask.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserTask;
