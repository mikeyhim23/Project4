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

@app.route('/')
def home():
    return "<h1>Welcome to Task Tracker App</h1>"

if __name__ == '__main__':
    app.run(debug=True)
