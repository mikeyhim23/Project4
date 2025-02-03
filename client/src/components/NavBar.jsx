import React from 'react';
import { Link } from 'react-router-dom';

const NavBar = () => {
  return (
    <div>
      <header>
        <h1>Task Tracker</h1>
      </header>
      <nav>
        <ul>
          <li><Link to="/tasks">Tasks</Link></li>
          <li><Link to="/projects">Projects</Link></li>
          <li><Link to="/users">Users</Link></li>
          <li><Link to="/user-tasks">User Tasks</Link></li>
        </ul>
      </nav>
    </div>
  );
};

export default NavBar;
