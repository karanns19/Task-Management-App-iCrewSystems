import { Component, OnInit } from '@angular/core';
import { TodoService } from '../services/todo.service';
import { AuthService } from '../services/auth.service';
import { AlertController } from '@ionic/angular';
import { Todo } from './todo.model';
import { Storage } from '@ionic/storage-angular';


@Component({
  selector: 'app-todolist',
  templateUrl: './todolist.page.html',
  styleUrls: ['./todolist.page.scss'],
})
export class TodolistPage implements OnInit {

  // Todo Array
  todos: Todo[] = [];
  todoId = 0;
  selectedOption: string = 'hightolow';


  ngOnInit() {
    // To load Todolist for the user
    this.loadTodos();
  }

  constructor(private authService: AuthService, private alertController: AlertController, private todoService: TodoService, private storage: Storage) {
    setInterval(() => {
      this.checkDueDates();
    }, 5000);
  }


  // Function to load all the todos
  loadTodos() {
    this.storage.get('email').then((email) => {
      if (email) {
        this.todoService.readTodo(email).subscribe((todos: Todo[]) => {
          this.todos = todos;
          // Sort todos based on priority
          if (this.selectedOption === 'hightolow') {
            this.sortTodosHighToLow();
          } else if (this.selectedOption === 'lowtohigh') {
            this.sortTodosLowToHigh();
          }
        });
      } else {
        console.log('User email not found in local storage', this.authService.getEmail);
        if (this.authService.getEmail !== '') {
          this.todoService.readTodo(this.authService.getEmail).subscribe((todos: Todo[]) => {
            this.todos = todos;
            if (this.selectedOption === 'hightolow') {
              this.sortTodosHighToLow();
            } else if (this.selectedOption === 'lowtohigh') {
              this.sortTodosLowToHigh();
            }
          });
        } else {
          console.log('User not logged in.');
        }
      }
    });
  }

  // Alert box to add todos
  async addTodo() {
    const alert = await this.alertController.create({
      header: 'Add Todo',
      inputs: [
        {
          name: 'title',
          type: 'text',
          placeholder: 'Title'
        },
        {
          name: 'description',
          type: 'text',
          placeholder: 'Description'
        },
        {
          name: 'due_date',
          type: 'date',
          placeholder: 'Due Date'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Save',
          handler: async (data) => {
            const todo: Todo = {
              id: 100,
              title: data.title,
              description: data.description,
              priority: 'Low',
              completed: false,
              due_date: data.due_date
            };
            this.storage.get('email').then((email) => {
              if (email) {
                this.todoService.createTodo(email, todo).subscribe(() => {
                  this.loadTodos();
                });
              } else {
                console.log('User email not found in local storage');
              }
            });
          }
        }
      ]
    });

    await alert.present();
  }

  // Alert box to edit todos
  async editTodo(todo: Todo) {
    const alert = await this.alertController.create({
      header: 'Edit Todo',
      inputs: [
        {
          name: 'title',
          type: 'text',
          value: todo.title,
          placeholder: 'Title'
        },
        {
          name: 'description',
          type: 'text',
          value: todo.description,
          placeholder: 'Description'
        },
        {
          name: 'priority',
          type: 'text',
          value: todo.priority,
          placeholder: 'Priority',
          disabled: true
        },
        {
          name: 'due_date',
          type: 'date',
          value: todo.due_date,
          placeholder: 'Due Date'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Save',
          handler: async (data) => {
            // Ensure completed is a boolean
            const completed: boolean = data.completed === 'true';

            const updatedTodo: Todo = {
              id: todo.id,
              title: data.title,
              description: data.description,
              priority: data.priority,
              completed: completed,
              due_date: data.due_date
            };
            this.storage.get('email').then((email) => {
              if (email) {
                this.todoService.updateTodo(email, updatedTodo.id, updatedTodo).subscribe(
                  response => {
                    console.log(response);
                    this.loadTodos();
                  },
                  error => {
                    console.error(error);
                  }
                );
              } else {
                console.log('User email not found in local storage');
              }
            });
          }
        }
      ]
    });

    await alert.present();
  }

  completedTodo(todo: Todo) {
    const updatedTodo: Todo = {
      id: todo.id,
      title: todo.title,
      description: todo.description,
      priority: todo.priority,
      completed: todo.completed,
      due_date: todo.due_date
    };
    this.storage.get('email').then((email) => {
      if (email) {
        this.todoService.updateTodo(email, todo.id, updatedTodo).subscribe(
          response => {
            console.log(response);
            this.loadTodos();
          },
          error => {
            console.error(error);
          }
        );
      } else {
        console.error('Error updating todo status:');
        todo.completed = !todo.completed;
      }
    });
  }

  // Function to delete todos
  deleteTodo(todo: Todo) {
    this.storage.get('email').then((email) => {
      if (email) {
        this.todoService.deleteTodo(email, todo.id).subscribe(() => {
          this.todos = this.todos.filter(t => t.id !== todo.id);
        });
      } else {
        console.log('User email not found in local storage');
      }
    });
  }

  // Function to toggle sorting option
  toggleSortingOption() {
    console.log("s", this.selectedOption)
    if (this.selectedOption === 'hightolow') {
      this.sortTodosHighToLow();
    } else {
      this.selectedOption = 'hightolow';
      this.sortTodosLowToHigh();
    }
  }

  // Function to sort todos from high to low priority
  sortTodosHighToLow() {
    this.todos.sort((a, b) => {
      if (a.priority === 'High' && b.priority !== 'High') {
        return -1;
      } else if (a.priority === 'Medium' && b.priority === 'Low') {
        return -1;
      } else if (a.priority === 'Low' && b.priority !== 'Low') {
        return 1;
      } else {
        return 0;
      }
    });
  }

  // Function to sort todos from low to high priority
  sortTodosLowToHigh() {
    this.todos.sort((a, b) => {
      if (a.priority === 'Low' && b.priority !== 'Low') {
        return -1;
      } else if (a.priority === 'Medium' && b.priority === 'High') {
        return -1;
      } else if (a.priority === 'High' && b.priority !== 'High') {
        return 1;
      } else {
        return 0;
      }
    });
  }

  checkDueDates() {
    const currentDate = new Date();

    this.todos.forEach(todo => {
      const dueDate = todo.due_date instanceof Date ? todo.due_date : new Date(todo.due_date);

      if (dueDate && dueDate < currentDate) {
        const labels = document.querySelectorAll('.todo-label');
        labels.forEach(label => {
          if (label.textContent && label.textContent.includes(todo.title)) {
            if (!label.classList.contains('past-due')) {
              label.classList.add('past-due');

              // Add text after title
              const textNode = document.createElement('span');
              textNode.textContent = '- Please Reschedule Task';
              textNode.classList.add('past-due-text'); // Add the class here
              label.appendChild(textNode);
            }
          }
        });
      }
    });
  }


  // Function to handle Logout
  logout() {
    this.authService.logout()
  }
}

