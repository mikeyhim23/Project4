import React from "react"
import User from './components/User'
import Task from './components/Task'
import Project from './components/Project'
import UserList from './components/UserList'


const App =() => {
  return (
    <div className="app">
      <h1>Task Tracker App</h1>
      <User />
      <Task/>
      <Project/>
      <UserList/>
    </div>
  )
}

export default App
