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

    def serialize(self):
        return {'id': self.id, 'username': self.username, 'email': self.email}

class Project(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    description = db.Column(db.String(250))
    
    user_tasks = db.relationship('UserTask', back_populates='project')

    def serialize(self):
        return {'id': self.id, 'name': self.name, 'description': self.description}

class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(50), nullable=False)
    description = db.Column(db.String(250))
    status = db.Column(db.String, default='pending')
    
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    user = db.relationship('User', back_populates='tasks')

    def serialize(self):
        return {'id': self.id, 'title': self.title, 'description': self.description, 'status': self.status, 'user_id': self.user_id}

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

    def serialize(self):
        return {'id': self.id, 'user_id': self.user_id, 'project_id': self.project_id, 'role': self.role, 'user': self.user.username, 'project': self.project.name}

class TaskResource(Resource):
    def get(self, task_id=None):
        if task_id:
            task = Task.query.get(task_id)
            if task:
                return task.serialize(), 200
            return {'message': 'Task not found'}, 404
        tasks = Task.query.all()
        return [task.serialize() for task in tasks], 200

    def post(self):
        data = request.get_json()
        title = data['title']
        description = data['description']
        user_id = data['user_id']
        
        new_task = Task(title=title, description=description, user_id=user_id)
        db.session.add(new_task)
        db.session.commit()
        return new_task.serialize(), 201

    def put(self, task_id):
        task = Task.query.get(task_id)
        if not task:
            return {'message': 'Task not found'}, 404
        
        data = request.get_json()
        task.title = data['title']
        task.description = data['description']
        task.status = data['status']
        db.session.commit()
        return task.serialize(), 200

    def delete(self, task_id):
        task = Task.query.get(task_id)
        if task:
            db.session.delete(task)
            db.session.commit()
            return {'message': 'Task deleted'}, 200
        return {'message': 'Task not found'}, 404


class UserResource(Resource):
    def get(self, user_id=None):
        if user_id:
            user = User.query.get(user_id)
            if user:
                return user.serialize(), 200
            return {'message': 'User not found'}, 404
        users = User.query.all()
        return [user.serialize() for user in users], 200

    def post(self):
        data = request.get_json()
        username = data['username']
        email = data['email']
        
        new_user = User(username=username, email=email)
        db.session.add(new_user)
        db.session.commit()
        return new_user.serialize(), 201

    def delete(self, user_id):
        user = User.query.get(user_id)
        if user:
            db.session.delete(user)
            db.session.commit()
            return {'message': 'User deleted'}, 200
        return {'message': 'User not found'}, 404


class ProjectResource(Resource):
    def get(self, project_id=None):
        if project_id:
            project = Project.query.get(project_id)
            if project:
                return project.serialize(), 200
            return {'message': 'Project not found'}, 404
        projects = Project.query.all()
        return [project.serialize() for project in projects], 200

    def post(self):
        data = request.get_json()
        name = data['name']
        description = data.get('description')
        
        new_project = Project(name=name, description=description)
        db.session.add(new_project)
        db.session.commit()
        return new_project.serialize(), 201

    def delete(self, project_id):
        project = Project.query.get(project_id)
        if project:
            db.session.delete(project)
            db.session.commit()
            return {'message': 'Project deleted'}, 200
        return {'message': 'Project not found'}, 404


class UserTaskResource(Resource):
    def get(self, user_task_id=None):
        if user_task_id:
            user_task = UserTask.query.get(user_task_id)
            if user_task:
                return user_task.serialize(), 200
            return {'message': 'UserTask not found'}, 404
        user_tasks = UserTask.query.all()
        return [user_task.serialize() for user_task in user_tasks], 200

    def post(self):
        data = request.get_json()
        user_id = data['user_id']
        project_id = data['project_id']
        role = data['role']
        
        new_user_task = UserTask(user_id=user_id, project_id=project_id, role=role)
        db.session.add(new_user_task)
        db.session.commit()
        return new_user_task.serialize(), 201

    def delete(self, user_task_id):
        user_task = UserTask.query.get(user_task_id)
        if user_task:
            db.session.delete(user_task)
            db.session.commit()
            return {'message': 'UserTask deleted'}, 200
        return {'message': 'UserTask not found'}, 404

api.add_resource(TaskResource, '/task', '/task/<int:task_id>')
api.add_resource(UserResource, '/user', '/user/<int:user_id>')
api.add_resource(ProjectResource, '/project', '/project/<int:project_id>')
api.add_resource(UserTaskResource, '/user_task', '/user_task/<int:user_task_id>')

if __name__ == '__main__':
    app.run(debug=True)
