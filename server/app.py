from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_migrate import Migrate
from flask_restful import Api, Resource

app = Flask(__name__)
CORS(app, supports_credentials=True)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///tasks.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
api = Api(app)

migrate = Migrate(app, db)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(50), unique=True, nullable=False)

    tasks = db.relationship('Task', back_populates='user')
    user_tasks = db.relationship('UserTask', back_populates='user')

class Project(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    description = db.Column(db.String(250))

    user_tasks = db.relationship('UserTask', back_populates='project')

class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(50), nullable=False)
    description = db.Column(db.String(250))
    status = db.Column(db.String, default='pending')

    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    user = db.relationship('User', back_populates='tasks')

class UserTask(db.Model):
    __tablename__ = 'user_task'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    project_id = db.Column(db.Integer, db.ForeignKey('project.id'), nullable=False)
    role = db.Column(db.String(50), nullable=False)

    user = db.relationship('User', back_populates='user_tasks')
    project = db.relationship('Project', back_populates='user_tasks')

    def __repr__(self):
        return f'<UserTask {self.user.username} - {self.project.name}>'


class UserResource(Resource):
    def get(self, user_id):
        user = User.query.get(user_id)
        if not user:
            return {'message': 'User not found'}, 404
        return jsonify({'id': user.id, 'username': user.username, 'email': user.email})

    def post(self):
        data = request.get_json()
        if User.query.filter_by(username=data['username']).first():
            return {'message': 'Username already taken'}, 400
        if '@' not in data['email']:
            return {'message': 'Invalid email format, must contain "@"'}, 400
        
        new_user = User(username=data['username'], email=data['email'])
        db.session.add(new_user)
        db.session.commit()
        return jsonify({'id': new_user.id, 'username': new_user.username, 'email': new_user.email})

class TaskResource(Resource):
    def get(self, task_id=None):
        if task_id:
            task = Task.query.get(task_id)
            if not task:
                return {'message': 'Task not found'}, 404
            return jsonify({'id': task.id, 'title': task.title, 'description': task.description, 'status': task.status})
        else:
            tasks = Task.query.all()
            return jsonify([{'id': task.id, 'title': task.title, 'description': task.description, 'status': task.status} for task in tasks])

    def post(self):
        data = request.get_json()
        if not data.get('title'):
            return {'message': 'Title is required'}, 400
        user = User.query.get(data.get('user_id'))
        if not user:
            return {'message': 'User not found'}, 404

        valid_statuses = ['pending', 'in-progress', 'completed']
        status = data.get('status', 'pending')
        if status not in valid_statuses:
            return {'message': f"Invalid status. Valid options are: {', '.join(valid_statuses)}"}, 400
        
        new_task = Task(
            title=data['title'], 
            description=data.get('description', ''),
            status=status, 
            user_id=data['user_id']
        )
        db.session.add(new_task)
        db.session.commit()
        
        return jsonify({
            'id': new_task.id,
            'title': new_task.title,
            'description': new_task.description,
            'status': new_task.status
        }), 201

    def put(self, task_id):
        task = Task.query.get(task_id)
        if not task:
            return {'message': 'Task not found'}, 404

        data = request.get_json()
        if 'title' in data and not data['title']:
            return {'message': 'Title cannot be empty'}, 400
        valid_statuses = ['pending', 'in-progress', 'completed']
        if 'status' in data and data['status'] not in valid_statuses:
            return {'message': f"Invalid status. Valid options are: {', '.join(valid_statuses)}"}, 400

        task.title = data.get('title', task.title)
        task.description = data.get('description', task.description)
        task.status = data.get('status', task.status)

        db.session.commit()
        return jsonify({
            'id': task.id,
            'title': task.title,
            'description': task.description,
            'status': task.status
        })

    def delete(self, task_id):
        task = Task.query.get(task_id)
        if not task:
            return {'message': 'Task not found'}, 404

        db.session.delete(task)
        db.session.commit()
        return {'message': 'Task deleted successfully'}

class ProjectResource(Resource):
    def get(self, project_id):
        project = Project.query.get(project_id)
        if not project:
            return {'message': 'Project not found'}, 404
        return jsonify({'id': project.id, 'name': project.name, 'description': project.description})
    
    def post(self):
        data = request.get_json()
        new_project = Project(name=data['name'], description=data['description'])
        db.session.add(new_project)
        db.session.commit()
        return jsonify({'id': new_project.id, 'name': new_project.name, 'description': new_project.description})



class UserTaskResource(Resource):
    def get(self, usertask_id):
        user_task = UserTask.query.get(usertask_id)
        if not user_task:
            return {'message': 'UserTask not found'}, 404
        return jsonify({
            'id': user_task.id,
            'role': user_task.role,
            'user_id': user_task.user_id,
            'project_id': user_task.project_id,
            'user': user_task.user.username,
            'project': user_task.project.name
        })

    def post(self):
        data = request.get_json()
        new_user_task = UserTask(user_id=data['user_id'], project_id=data['project_id'], role=data['role'])
        db.session.add(new_user_task)
        db.session.commit()
        return jsonify({
            'id': new_user_task.id,
            'role': new_user_task.role,
            'user_id': new_user_task.user_id,
            'project_id': new_user_task.project_id,
            'user': new_user_task.user.username,
            'project': new_user_task.project.name
        })

api.add_resource(UserResource, '/users', '/users/<int:user_id>')
api.add_resource(TaskResource, '/tasks', '/tasks/<int:task_id>')
api.add_resource(ProjectResource, '/projects', '/projects/<int:project_id>')
api.add_resource(UserTaskResource, '/user_tasks', '/user_tasks/<int:usertask_id>')

@app.route('/')
def home():
    return "<h1>Welcome to Task Tracker App</h1>"

if __name__ == '__main__':
    app.run(debug=True)
