from django.contrib import admin
from .models import UserModel, Todo

# To Include Users Model in Admin
class UsersAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'is_verified')
    search_fields = ('username', 'email')

admin.site.register(UserModel, UsersAdmin)


# To include Todos Model in Admin
class TodoAdmin(admin.ModelAdmin):
    list_display = ('user', 'title', 'description', 'priority', 'completed', 'due_date')
    list_filter = ('priority', 'completed')
    search_fields = ('user__username', 'title', 'description')

admin.site.register(Todo, TodoAdmin)