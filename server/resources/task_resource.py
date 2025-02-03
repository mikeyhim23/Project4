from flask_restful import Resource
from flask import request
from models import db, Task

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
        title = data.get('title')
        description = data.get('description')
        user_id = data.get('user_id')
        
        # Validate data
        if not title or not description or not user_id:
            return {'message': 'Missing required fields'}, 400
        
        new_task = Task(title=title, description=description, user_id=user_id)
        db.session.add(new_task)
        db.session.commit()
        return new_task.serialize(), 201

    def put(self, task_id):
        task = Task.query.get(task_id)
        if not task:
            return {'message': 'Task not found'}, 404
        
        data = request.get_json()
        title = data.get('title')
        description = data.get('description')
        status = data.get('status')
        user_id = data.get('user_id')

        # Validate data
        if not title or not description or not status or not user_id:
            return {'message': 'Missing required fields'}, 400
        
        task.title = title
        task.description = description
        task.status = status
        task.user_id = user_id
        db.session.commit()
        return task.serialize(), 200

    def delete(self, task_id):
        task = Task.query.get(task_id)
        if task:
            db.session.delete(task)
            db.session.commit()
            return {'message': 'Task deleted'}, 200
        return {'message': 'Task not found'}, 404