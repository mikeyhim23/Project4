import React, { useState } from 'react';

const UserForm = ({ onUserAdd }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username || !email) {
      setError('Both username and email are required.');
      return;
    }
    setError('');

    const userData = { username, email };

    fetch('https://task-project-ci1o.onrender.com/user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    })
      .then((response) => response.json())
      .then((data) => {
        onUserAdd(data)
        setUsername('')
        setEmail('')
      })
      .catch((error) => setError('Error creating user: ' + error.message))
  }

  return (
    <div>
      <h2>Create A New User</h2>
      {error && <div style={{ color: 'red' }}>{error}</div>}
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
        <button type="submit">Create User</button>
      </form>
    </div>
  );
};

export default UserForm;
