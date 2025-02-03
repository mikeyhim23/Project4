Task Tracker App
Overview
Welcome to the Task Tracker App! This application is designed to help you manage tasks, users, and projects in a streamlined and organized way. Whether you're an individual or part of a team, this app allows you to easily assign tasks to users, track progress on various projects, and manage user roles within those projects.

The app consists of both a backend (built using Flask) and a frontend (built with React), providing a robust system to manage all your task-related needs.

Features
Task Management: Assign tasks to users, view the details, update their status, or remove them when completed.
Project Management: Create and track projects, view project details, and see which tasks belong to which project.
User Management: Keep track of users, their emails, and usernames.
User-Task Assignment: Assign users to specific tasks within projects, define their roles, and manage those assignments efficiently.
Tech Stack
Backend:
Flask: A lightweight Python web framework to handle the backend operations.
Flask-SQLAlchemy: For ORM-based database interactions.
Flask-CORS: To allow cross-origin requests.
Flask-Migrate: To handle database migrations with Alembic.
Flask-Restful: To create RESTful APIs for task, user, and project management.
Dotenv: To securely manage environment variables like database URLs.
Frontend:
React: A JavaScript library for building user interfaces, making the app dynamic and responsive.
React Router: For managing navigation between different pages like tasks, users, and projects.
Database:
SQLAlchemy: An ORM for interacting with the database. The app uses SQLAlchemy models to store and retrieve data about users, tasks, and projects.
backend url = https://task-project-ci1o.onrender.com/
front end url = https://task-tracker-front-end-five.vercel.app/
