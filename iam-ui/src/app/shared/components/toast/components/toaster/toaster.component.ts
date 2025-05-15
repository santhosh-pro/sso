import {ChangeDetectionStrategy, ChangeDetectorRef, Component, input, OnInit} from '@angular/core';
import {ToastComponent} from "../toast/toast.component";
import {ToastEvent} from "../../models/toast-event";
import {ToastService} from "../../toast.service";

@Component({
  selector: 'app-toaster',
  standalone: true,
  imports: [
    ToastComponent
  ],
  templateUrl: './toaster.component.html',
  styleUrl: './toaster.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToasterComponent implements OnInit {
  themeType = input<'light' | 'dark'>('light');

  currentToasts: ToastEvent[] = [];

  constructor(
    private toastService: ToastService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.subscribeToToasts();
  }

  subscribeToToasts() {
    this.toastService.toastEvents.subscribe((toast) => {
      toast.themeType = this.themeType();
      this.currentToasts.push(toast);
      this.cdr.detectChanges();
    });
  }

  dispose(index: number) {
    this.currentToasts.splice(index, 1);
    this.cdr.detectChanges();
  }
}
