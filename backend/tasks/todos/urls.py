from django.urls import path
from . import views

urlpatterns = [
    # URLs for User Authentication and Registration
    path('register/', views.register_view, name='register_view'),
    path('login/', views.login_view, name='login_view'),
    path('verify/<str:token>/', views.verify_email, name='verify_email'),
    path('user-verification-status/', views.user_verification_status, name='user-verification-status'),
    # URLs for TodoList CRUD Operation
    path('todos/create_todo/', views.create_todo, name='create_todo'),
    path('read_todo/', views.read_todo, name='read_todo'),
    path('update_todo/<int:todo_id>/', views.update_todo, name='update_todo'),
    path('delete_todo/<int:todo_id>/', views.delete_todo, name='delete_todo'),
    path('', views.hello, name='hello')
]