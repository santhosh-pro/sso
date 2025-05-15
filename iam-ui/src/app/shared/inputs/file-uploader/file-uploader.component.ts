import {
  Component,
  OnInit,
  inject,
  input,
  output,
  AfterContentInit,
  signal
} from '@angular/core';
import {BaseControlValueAccessor} from "../../base/base-control-value-accessor";
import {FormControl, NgControl} from "@angular/forms";
import {SpinnerComponent} from "../../components/spinner/spinner.component";
import {HumanizeFormMessagesPipe} from '../humanize-form-messages.pipe';

@Component({
  selector: 'app-file-uploader',
  standalone: true,
  imports: [
    SpinnerComponent,
    HumanizeFormMessagesPipe
  ],
  templateUrl: './file-uploader.component.html',
  styleUrls: ['./file-uploader.component.scss']
})
export class FileUploaderComponent extends BaseControlValueAccessor implements OnInit, AfterContentInit {
  fullWidth = input(false);
  label = input<string | null>();
  isRequired = input(false);
  uploading = input(false);
  errorMessages = input<{ [key: string]: string }>({});

  fileSelected = output<File>();
  fileRemoved = output<void>();

  id = signal<string>('');

  selectedFile = signal<File | null>(null);

  ngControl = inject(NgControl, {optional: true, self: true});

  constructor() {
    super();
    if (this.ngControl) {
      this.ngControl!.valueAccessor = this;
    }
  }

  override onWriteValue(value: any): void {

  }

  ngAfterContentInit(): void {
    let formControl = this.ngControl?.control as FormControl;
    if (formControl) {
      this.formControl = this.ngControl?.control as FormControl;
    }
  }

  ngOnInit(): void {
    this.id.set(this.getId());
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const firstFile = input.files[0];
      this.onChange(firstFile);
      this.fileSelected.emit(firstFile);
      this.selectedFile.set(firstFile);
    }
  }

  onRemoveFileClicked() {
    this.onChange(null);
    this.selectedFile.set(null);
    this.fileRemoved.emit();
  }

  onViewFileClicked() {
    if (this.formControl.value == null) {
      return;
    }

    if (this.formControl.value instanceof File) {
      const file = this.formControl.value as File;
      if (file) {
        const url = URL.createObjectURL(file);
        window.open(url, '_blank');
      }
    } else {
      window.open(this.formControl.value, '_blank');
    }
  }

  private getId(): string {
    const randomNumber = Math.floor(1000 + Math.random() * 9000);
    return `file-input-${randomNumber.toString()}`;
  }

  getFileNameFromUrl(url: string): string {
    try {
      const parsedUrl = new URL(url);
      const pathname = parsedUrl.pathname;
      const fileName = pathname.split('/').pop();

      return fileName ? decodeURIComponent(fileName) : '';
    } catch {
      const fileName = url.split('/').pop();
      return fileName ? decodeURIComponent(fileName) : '';
    }
  }
}
