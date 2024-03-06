# Task Management App

## Description

This project combines the power of Ionic for the frontend and Django for the backend to create a Hybrid Task Management App.

## Features

- **Ionic Frontend**: Utilizes Ionic framework for building a mobile-friendly and responsive user interface.
- **Django Backend**: Employs Django framework for handling server-side logic, data management, and API endpoints.
- **Authentication**: Implements user authentication and authorization using Django's authentication system.
- **Database**: Uses Django's ORM to interact with a relational database (SQLite).
- **RESTful APIs**: Exposes RESTful APIs for frontend communication with the backend.

## Prerequisites

Before running the project, ensure you have the following installed:

- Node.js and npm (for Ionic)
- Python and pip (for Django)
- [Ionic CLI](https://ionicframework.com/docs/cli)
- [Django](https://www.djangoproject.com/download/)

## Installation

1. **Clone the repository:**
- git clone https://github.com/karanns19/Task-Management-App-iCrewSystems.git

2. **Set up the Ionic frontend:**
- cd ./frontend/todos
- npm install

3. **Set up the Django backend:**
- cd ./backend
- python -m venv env
- source env/bin/activate # On macOS and Linux
- pip install -r requirements.txt
- python manage.py migrate
- python manage.py createsuperuser # (Optional) Create admin user

## Usage

1. **Run the Django development server:**
- cd ./backend/tasks
- python manage.py runserver

2. **Run the Ionic development server:**
- cd ./frontend/todos
- ionic serve

## License

This project is licensed under the [MIT License](LICENSE).

