from django.db import models

# User Data Model
class UserModel(models.Model):
    username = models.CharField(max_length=150)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=128)
    is_verified = models.BooleanField(default=False)
    verification_token = models.CharField(max_length=64, null=True, blank=True)

    def __str__(self):
        return self.email

# Todo Data Model
class Todo(models.Model):
    user = models.ForeignKey(UserModel, on_delete=models.CASCADE)
    title = models.CharField(max_length=100)
    description = models.TextField()
    description = models.TextField()
    priority = models.TextField()
    completed = models.BooleanField(default=False)
    due_date = models.DateField(null=True, blank=True)