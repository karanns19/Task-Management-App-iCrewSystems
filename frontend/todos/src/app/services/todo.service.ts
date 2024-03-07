import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Todo } from '../todolist/todo.model';

@Injectable({
  providedIn: 'root'
})

// Service for handling Todolist CRUD Operations
export class TodoService {

  // Base API URL
  private apiUrl = 'https://karanns19.pythonanywhere.com/';

  constructor(private http: HttpClient) { }

  // Handle Create todo API Endpoint
  createTodo(email: string, todo: Todo): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/todos/create_todo/`, { email, ...todo });
  }

  // Handle Get todo API Endpoint
  readTodo(email: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/read_todo/?email=${email}`);
  }

  // Handle Update todo API Endpoint
  updateTodo(email: string, todoId: number, todo: Todo): Observable<any> {
    return this.http.put(`${this.apiUrl}/update_todo/${todoId}/`, { email, ...todo });
  }

  // Handle Delete todo API Endpoint
  deleteTodo(email: string, todoId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete_todo/${todoId}/?email=${email}`);
  }
}
