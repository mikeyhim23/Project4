import React, { useState, useEffect } from 'react'
import UserForm from '../components/UserForm'

const Users = () => {
  const [users, setUsers] = useState([])

  useEffect(() => {
    fetch('/user')
      .then((response) => response.json())
      .then((data) => setUsers(data))
      .catch((error) => console.error('Error fetching users:', error))
  }, [])

  const handleUserAdd = (user) => {
    setUsers([...users, user])
  }

  return (
    <div>
      <UserForm onUserAdd={handleUserAdd} />
      <h3>Existing Users</h3>
      <ul>
        {users.map((user) => (
          <li key={user.id}>{user.username} - {user.email}</li>
        ))}
      </ul>
    </div>
  )
}

export default Users
