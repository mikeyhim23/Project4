from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

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

    def serialize(self):
        return {'id': self.id, 'user_id': self.user_id, 'project_id': self.project_id, 'role': self.role, 'user': self.user.username, 'project': self.project.name}
