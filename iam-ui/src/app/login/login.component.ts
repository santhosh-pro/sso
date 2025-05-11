import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{
  form!: FormGroup;
  formBuilder = inject(FormBuilder);
  http = inject(HttpClient);
  route = inject(ActivatedRoute);

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      username: ['',[Validators.required]],
      password: ['',[Validators.required,]],
    });
  }

  onSubmit() {
    if (this.form.invalid) return;
  
    const loginData = this.form.value;
    const queryParams = this.route.snapshot.queryParams;
  
    const {
      client_id,
      redirect_uri,
      code_challenge,
      code_challenge_method,
      state,
    } = queryParams;
  
    // Combine login credentials and OIDC params into the request body
    const body = {
      ...loginData,
      client_id,
      redirect_uri,
      code_challenge,
      code_challenge_method,
      ...(state && { state }) // include state if it exists
    };
  
    const url = `http://localhost:3000/auth/login`;
  
    this.http.post(url, body, { withCredentials: true }).subscribe({
      next: (response: any) => {
        window.location.href = response.redirectUrl;
        console.log('Login successful:', response);
      },
      error: (error) => {
        console.error('Login failed:', error);
      }
    });
  }
  


}
