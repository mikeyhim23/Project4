import React, { useState } from 'react'

const UserForm = () => {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault();

    setError('');
    setSuccess('');

    if (!username || !email) {
      setError('Both username and email are required.')
      return
    }

    if (!email.includes('@') || !email.includes('.')) {
      setError('Invalid email format')
      return
    }

    const userData = { username, email };

    fetch('/user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        return response.json()
      })
      .then((data) => {
        setSuccess('User created successfully!')
      })
      .catch((error) => {
        setError('Error creating user: ' + error.message)
      })
  }

  return (
    <div>
      <h2>Create New User</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username"
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email"
            required
          />
        </div>
        {error && <div style={{ color: 'red' }}>{error}</div>}
        {success && <div style={{ color: 'green' }}>{success}</div>}
        <button type="submit">Create User</button>
      </form>
    </div>
  )
}

export default UserForm;
