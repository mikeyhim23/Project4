from flask_restful import Resource
from flask import request
from models import db, User

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