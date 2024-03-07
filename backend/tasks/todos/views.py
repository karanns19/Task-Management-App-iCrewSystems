# Imports for User Authentication & TodoList Views
from django.core.mail import send_mail
from django.conf import settings
from django.contrib.auth.hashers import check_password, make_password
from django.core.management.utils import get_random_secret_key
from django.shortcuts import get_object_or_404
from django.http import JsonResponse, HttpResponse
from .models import UserModel
from .models import Todo
import uuid
import json


# User Registration View
def register_view(request):
    if request.method == 'POST':
        # Get User data from Request
        data = json.loads(request.body)
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')
        
        if not username or not email or not password:
            return JsonResponse({'status': 'error', 'message': 'All fields are required'})
        
        try:
            UserModel.objects.get(email=email)
            return JsonResponse({'status': 'error', 'message': 'Email already exists'})
        except UserModel.DoesNotExist:
            pass
        
        # Generate a unique token for verification
        verification_token = str(uuid.uuid4())[:8]
        send_verification_email(email, verification_token)
        token = get_random_secret_key()
        # Hash Password Securely
        user = UserModel.objects.create(username=username, email=email, password=make_password(password), verification_token=verification_token)
        user.save()
        return JsonResponse({'status': 'success',  'token': token})
    else:
        return JsonResponse({'status': 'error', 'message': 'Method not allowed'})


# User Login View
def login_view(request):
    if request.method == 'POST':
        # Get User data from Request
        data = json.loads(request.body)
        email = data.get('email')
        password = data.get('password')
        
        if not email or not password:
            return JsonResponse({'status': 'error', 'message': 'Email and password are required'})
        
        try:
            user = UserModel.objects.filter(email=email).first()
            # Verify Email and Password Checker
            if user is not None and check_password(password, user.password):
                if user.is_verified:
                    token = get_random_secret_key()
                    response = JsonResponse({'status': 'success', 'token': token})
                    return response
                else:
                    return JsonResponse({'status': 'error', 'message': 'Please verify your email address'})
            else:
                return JsonResponse({'status': 'error', 'message': 'Invalid email or password'})
        except UserModel.DoesNotExist:
            return JsonResponse({'status': 'error', 'message': 'Invalid email or password'})
    else:
        return JsonResponse({'status': 'error', 'message': 'Method not allowed'})


# User Logout View
def logout(request):
    response = JsonResponse({'status': 'success'})
    response.delete_cookie('token')
    return response


# Function to verify user
def verify_email(request, token):
    try:
        user = UserModel.objects.get(verification_token=token)
        user.is_verified = True
        user.save()
        return JsonResponse({'status': 'Email Verified Successfully'})
    except UserModel.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': 'Invalid token'})


# Function to send verification email the user
def send_verification_email(email, token):
    subject = 'Verify your email address'
    message = f'Click the following link to verify your email address: {settings.BASE_URL}/verify/{token}'
    from_email = settings.EMAIL_HOST_USER
    recipient_list = [email]
    send_mail(subject, message, from_email, recipient_list)


# Function to check user verification status
def user_verification_status(request):
    if request.method == 'GET':
        email = request.GET.get('email')
        try:
            user = UserModel.objects.get(email=email)
            return JsonResponse({'isVerified': user.is_verified}, status=200)
        except UserModel.DoesNotExist:
            return JsonResponse({'error': 'User not found'}, status=404)
    else:
        return JsonResponse({'error': 'Method not allowed'}, status=405)
    

# Create Todos View
def create_todo(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        email = data.get('email')

        try:
            user = UserModel.objects.get(email=email)
        except UserModel.DoesNotExist:
            return JsonResponse({'error': 'User not found'}, status=404)

        # Create a todo associated with the user
        todo = Todo.objects.create(
            user=user,
            title=data.get('title'),
            description=data.get('description'),
            priority=data.get('priority'),
            completed=data.get('completed'),
            due_date=data.get('due_date')
        )
        return JsonResponse({'message': 'Todo created successfully'})
    else:
        return JsonResponse({'error': 'Method not allowed'}, status=405)


# Get TodoList View
def read_todo(request):
    if request.method == 'GET':
        email = request.GET.get('email')
        todos = Todo.objects.filter(user__email=email)
        todo_list = []
        for todo in todos:
            todo_data = {
                'id': todo.id,
                'title': todo.title,
                'description': todo.description,
                'priority': todo.priority,
                'completed': todo.completed,
                'due_date': str(todo.due_date),
                'user_id': todo.user.id
            }
            todo_list.append(todo_data)
        return JsonResponse(todo_list, safe=False)
    else:
        return JsonResponse({'error': 'Method not allowed'}, status=405)


# Update Todo View
def update_todo(request, todo_id):
    if request.method == 'PUT':
        try:
            data = json.loads(request.body)
            email = data.get('email')
            user = UserModel.objects.get(email=email)
            todo = Todo.objects.get(id=todo_id, user=user)
            todo.id = todo_id
            todo.title = data.get('title', todo.title)
            todo.description = data.get('description', todo.description)
            todo.priority = data.get('priority', todo.priority)
            todo.completed = data.get('completed', todo.completed)
            todo.due_date = data.get('due_date', todo.due_date)
            todo.save()
            return JsonResponse({'message': 'Todo updated successfully'})
        except UserModel.DoesNotExist:
            return JsonResponse({'error': 'User not found'}, status=404)
        except Todo.DoesNotExist:
            return JsonResponse({'error': 'Todo not found'}, status=404)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    else:
        return JsonResponse({'error': 'Method not allowed'}, status=405)


# Delete Todo View
def delete_todo(request, todo_id):
    if request.method == 'DELETE':
        email = request.GET.get('email')
        user = get_object_or_404(UserModel, email=email)
        todo = get_object_or_404(Todo, id=todo_id, user=user)
        todo.delete()
        return JsonResponse({'message': 'Todo deleted successfully'})
    else:
        return JsonResponse({'error': 'Method not allowed'}, status=405)
    

# Just to test Hosting Web App
def hello(request):
    return HttpResponse("Hello, Welcome to Task Management")