import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, from } from 'rxjs';
import { Storage } from '@ionic/storage-angular';
import { switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
// Service for handling User Authentication 
export class AuthService {

  // Storage Variable
  private _storage: Storage | null = null;
  // Base API URL
  private baseUrl = 'http://127.0.0.1:8000/';
  getEmail: string = ''

  public isAuthenticatedSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public isAuthenticated$: Observable<boolean> = this.isAuthenticatedSubject.asObservable();

  constructor(private http: HttpClient, private storage: Storage, private router: Router) { 
    this.initStorage();
  }

  // Register API Endpoint Function
  register(username: string, email: string, password: string): Observable<any> {
    return this.http.post<any>(this.baseUrl + 'register/', { username, email, password })
  }

  // Login API Endpoint Function
  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(this.baseUrl + 'login/', { email, password })
  }
  // Check User Verification API Endpoint Function
  getUserVerificationStatus(email: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}user-verification-status/?email=${email}`);
  }

  // Initializes Local Storage
  private async initStorage() {
    const storage = await this.storage.create();
    this._storage = storage;
  }

  // Function to check if the user is authenticated
  isAuthenticated(): Observable<boolean> {
    return from(this.initStorage()).pipe(
      switchMap(() => {
        return new Observable<boolean>(observer => {
          if (this._storage) {
            observer.next(true);
          } else {
            observer.next(false);
            observer.complete();
          }
        });
      })
    );
  }

  // Logout Function
  logout() {
    if (this._storage) {
      // Will remove token
      this.storage.remove('token').then(() => {
        this.storage.remove('email').then(() => {
          this.router.navigate(['/']);
          this.isAuthenticatedSubject.next(false);
        });
      });
    } else {
      this.router.navigate(['/']);
    }
  }
}
