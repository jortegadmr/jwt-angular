import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, FormGroup, Validators } from '@angular/forms';
import { RouterLink, RouterOutlet, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { LoginRequest } from '../../services/auth/loginRequest';
import { LoginService } from '../../services/auth/login.service';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    RouterOutlet,
    CommonModule,
  ],

  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent implements OnInit{
  loginError: string = '';
  loginForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private router: Router, private loginService: LoginService) {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  get username(){
    return this.loginForm.get('username');
  }
  get password(){
    return this.loginForm.get('password');
  }
  login(){
    if (this.loginForm.valid) {
      this.loginService.login(this.loginForm.value as LoginRequest).subscribe({
        next: (userData) => {
          /* console.log(userData); */
        },
        error: (errorData) => {
          console.log(errorData);
          this.loginError=errorData;

        },
        complete: () => {
          console.log('Login completado');
          this.router.navigate(['inicio']);
          this.loginForm.reset();
        }
      });

      
    }
    else {
      this.loginForm.markAllAsTouched();
      alert('Usuario o contraseña incorrectos');
    }
  }
}

