import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import Tasks from './pages/Tasks';
import Projects from './pages/Projects';
import Users from './pages/Users';
import UserTasks from './pages/UserTasks';

const App = () => {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/users" element={<Users />} />
        <Route path="/user-tasks" element={<UserTasks />} />
      </Routes>
    </Router>
  )
}

export default App;
