from flask_restful import Resource
from flask import request
from models import db, Project

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

    def put(self, project_id):
        project = Project.query.get(project_id)
        if not project:
            return {'message': 'Project not found'}, 404
        
        data = request.get_json()
        project.name = data.get('name', project.name)
        project.description = data.get('description', project.description)
        
        db.session.commit()
        return project.serialize(), 200

    def delete(self, project_id):
        project = Project.query.get(project_id)
        if project:
            db.session.delete(project)
            db.session.commit()
            return {'message': 'Project deleted'}, 200
        return {'message': 'Project not found'}, 404