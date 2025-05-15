import { Component, inject, OnInit } from '@angular/core';
import { BaseOverlayComponent } from "../../../../shared/components/overlay/base-overlay/base-overlay.component";
import { TextInputComponent } from "../../../../shared/inputs/text-input/text-input.component";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonComponent } from "../../../../shared/components/button/button.component";
import { BaseComponent } from '@shared/base/base-component';
import { ApiService } from '@core/api/api.service';
import { DialogRef } from '@angular/cdk/dialog';
import { CreateUserResponse, GetRoleListResponse } from '@core/api/model';
import { State } from '@shared/public-api';
import { SingleSelectionFieldComponent } from "../../../../shared/inputs/single-selection-field/single-selection-field.component";

@Component({
  selector: 'app-create-user',
  imports: [BaseOverlayComponent, TextInputComponent, ReactiveFormsModule, ButtonComponent, SingleSelectionFieldComponent],
  templateUrl: './create-user.component.html',
  styleUrl: './create-user.component.css'
})
export class CreateUserComponent extends BaseComponent implements OnInit {

  form!: FormGroup;
  formBuilder = inject(FormBuilder);
  apiService = inject(ApiService);
  dialogRef = inject(DialogRef);
  createUser = new State<CreateUserResponse>();
  roleList = new State<GetRoleListResponse>();

  getRoles() {
    this.executeRequest<GetRoleListResponse>({
      state: this.roleList,
      request: this.apiService.getRoleList(),
      handleSuccess: false,
      handleError: true,
    });
  }

  buildForm() {
    this.form = this.formBuilder.group({
      firstName: ['', [Validators.required,]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.email]],
      phoneNumber: [''],
      password: ['', [Validators.required]],
      role: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.getRoles();
    this.buildForm();
  }

  onSubmit() {
    console.log(this.form.value);
  }

}
