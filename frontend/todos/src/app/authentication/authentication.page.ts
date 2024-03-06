import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as Notiflix from 'notiflix';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.page.html',
  styleUrls: ['./authentication.page.scss'],
})
export class AuthenticationPage implements OnInit {

  // Variable to handle login and registration form
  username!: string;
  email!: string;
  password!: string;
  isLogin: boolean = true;
  authForm!: FormGroup;

  constructor(private authService: AuthService, private router: Router, private formBuilder: FormBuilder, private storage: Storage) { }

  ngOnInit() {
    this.authForm = this.formBuilder.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]], // Add email validation
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  // Function to handle toggle between login and registration form
  toggleForm() {
    this.isLogin = !this.isLogin;
  }

  // Function to handle Login
  login() {
    Notiflix.Loading.circle()
    const { email, password } = this.authForm.value;
    this.authService.login(email, password)
      .subscribe({
        next: response => {
          const token = response.token
          if (response.status == 'success') {
            this.authService.isAuthenticatedSubject.next(true);
            this.storage.create().then(() => {
              this.storage.set('token', token);
              this.storage.set('email', email);
            });
            Notiflix.Loading.remove()
            this.router.navigate(['/todolist']);
            Notiflix.Notify.success('Login Successfully');
          } else if (response.message == 'Please verify your email address') {
            Notiflix.Loading.remove()
            Notiflix.Notify.info('Please verify your email address')
          } else {
            Notiflix.Loading.remove()
            Notiflix.Notify.failure('Invalid email or password')
          }
        },
        error: error => {
          Notiflix.Loading.remove()
          console.error(error);
        }
      });
  }

  // Function to handle Register
  register() {
    if (this.authForm.valid) {
      Notiflix.Loading.circle()
      const { username, email, password } = this.authForm.value;
      this.authService.register(username, email, password)
        .subscribe({
          next: response => {
            if (response.status == 'success') {
              Notiflix.Loading.remove()
              this.router.navigate(['/verification']);
              Notiflix.Notify.success('Register Successfully')
              this.checkVerificationStatus(email);
            } else {
              Notiflix.Loading.remove()
              Notiflix.Notify.failure('User already exists')
            }
          },
          error: error => {
            Notiflix.Loading.remove()
            console.error(error);
          }
        });
    }
  }

  // Function to check user Verification status
  checkVerificationStatus(email: string) {
    const interval = setInterval(() => {
      this.authService.getUserVerificationStatus(email)
        .subscribe((response: any) => {
          if (response.isVerified) {
            this.authService.isAuthenticatedSubject.next(true);
            const token = response.token
            this.storage.create().then(() => {
              this.storage.set('token', token);
              this.storage.set('email', email);
            });
            clearInterval(interval);
            this.router.navigate(['/todolist']);
            Notiflix.Notify.success('Verification Successful');
          }
        });
    }, 3000);
  }
}
