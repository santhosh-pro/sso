import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-callback',
  standalone: true,
  imports: [],
  templateUrl: './callback.component.html',
  styleUrl: './callback.component.css'
})
export class CallbackComponent implements OnInit {
  route = inject(ActivatedRoute);


  ngOnInit(): void {
    const queryParams = this.route.snapshot.queryParams;
    console.log('Query Params:', queryParams);
  
  }

}
