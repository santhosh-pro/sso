import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonComponent } from "../../shared/components/button/button.component";
import { LoginResponse } from '@core/api/model';
import { ApiService } from '@core/api/api.service';
import { TextInputComponent } from '@shared/components/input/text-input/text-input.component';
import { BaseComponent } from '@shared/core/base-component';
import { State } from '@shared/core/base-state';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, TextInputComponent, ButtonComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent extends BaseComponent implements OnInit{
  form!: FormGroup;
  formBuilder = inject(FormBuilder);
    apiService = inject(ApiService);
  
login = new State<LoginResponse>();

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      username: ['',[Validators.required]],
      password: ['',[Validators.required,]],
    });
  }

  // onSubmit() {
  //   if (this.form.invalid) return;
  
  //   const loginData = this.form.value;
  //   const queryParams = this.route.snapshot.queryParams;
  
  //   const {
  //     client_id,
  //     redirect_uri,
  //     code_challenge,
  //     code_challenge_method,
  //     state,
  //   } = queryParams;
  
  //   // Combine login credentials and OIDC params into the request body
  //   const body = {
  //     ...loginData,
  //     client_id,
  //     redirect_uri,
  //     code_challenge,
  //     code_challenge_method,
  //     ...(state && { state }) // include state if it exists
  //   };
  
  //   const url = `http://localhost:3000/auth/login`;
  
  //   this.http.post(url, body, { withCredentials: true }).subscribe({
  //     next: (response: any) => {
  //       window.location.href = response.redirectUrl;
  //       console.log('Login successful:', response);
  //     },
  //     error: (error) => {
  //       console.error('Login failed:', error);
  //     }
  //   });
  // }
  
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

    // Build the request body
    const body = {
      ...loginData,
      client_id,
      redirect_uri,
      code_challenge,
      code_challenge_method,
      ...(state && { state }),
    };

    const url = `http://localhost:3000/auth/login`;

    this.executeRequest<LoginResponse>({
      state: this.login,
      request: this.apiService.login(body, {withCredentials: true}),
      handleError: true,
      onSuccess: async (response) => {
        console.log('Login successful:', response);

        // Redirect user to response URL if provided
        if (response.redirectUrl) {
          window.location.href = response.redirectUrl;
        } else {
          this.router.navigate(['/approval']);
        }
      },
    });
  }

}
