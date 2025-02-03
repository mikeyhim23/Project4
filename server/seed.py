from models import db, User, Project, Task, UserTask
import random
from faker import Faker

fake = Faker()

def seed_users():
    users = []
    for i in range(30):
        username = fake.user_name()
        email = fake.email()
        user = User(username = username, email = email)
        users.append(user)

    db.session.add_all(users)
    db.session.commit()

def seed_projects():
    projects = []
    for i in range(10):
        name = fake.name()
        description = fake.sentence()
        project = Project(name = name, description = description)
        projects.append(project)

    db.session.add_all(projects)
    db.session.commit()

def seed_tasks():
    tasks = []
    user_ids = [user.id for user in User.query.all()]
    for i in range(30):
        title = fake.bs()
        description = fake.text()
        status = random.choice(['pending', 'in-progress', 'completed'])
        user_id = random.choice(user_ids)
        task = Task(title = title, description = description, status = status, user_id = user_id)
        tasks.append(task)

    db.session.add_all(tasks)
    db.session.commit()

def seed_user_tasks():
    user_tasks = []
    user_ids = [user.id for user in User.query.all()]
    project_ids = [project.id for project in Project.query.all()]

    for i in range(30):
        user_id = random.choice(user_ids)
        project_id = random.choice(project_ids)
        role = random.choice(('Manager', 'Developer', 'designer', 'Tester'))
        user_task = UserTask(user_id = user_id, project_id = project_id, role = role)
        user_tasks.append(user_task)

    db.session.add_all(user_tasks)
    db.session.commit()

def seed_db():
    seed_users()
    seed_projects()
    seed_tasks()
    seed_user_tasks()

if __name__ == '__main__':
    from app import app
    with app.app_context():
        seed_db()
 