import { Component, inject, OnInit } from '@angular/core';
import { BaseComponent } from '@shared/base/base-component';
import { OverlayService } from '@shared/public-api';
import { CreateUserComponent } from './create-user.component';

@Component({
  selector: 'app-create-user-model',
  template:'',
})
export class CreateUserModelComponent extends BaseComponent implements OnInit {


  overlayService = inject(OverlayService);

    ngOnInit(): void {
     const dialogRef = this.overlayService.openModal(CreateUserComponent, {
        disableClose: true,
      });
      dialogRef.closed.subscribe(() => {
       this.router.navigate(['/main']);
      });
  }
}
