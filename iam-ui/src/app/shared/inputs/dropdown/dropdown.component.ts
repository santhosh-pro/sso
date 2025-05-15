import {
  AfterContentInit, ChangeDetectorRef,
  Component, ElementRef, HostListener,
  inject,
  input, OnChanges,
  output, Renderer2,
  signal, SimpleChanges, viewChild, ViewChild
} from '@angular/core';
import {AppSvgIconComponent} from "../../components/app-svg-icon/app-svg-icon.component";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {BaseInputComponent} from '../_base/base-input/base-input.component';
import {State} from '../../base/base-state';
import {NgClass} from "@angular/common";
import {HumanizeFormMessagesPipe} from "../humanize-form-messages.pipe";
import {
  CdkConnectedOverlay,
  Overlay
} from "@angular/cdk/overlay";
import {resolveTemplateWithObject} from "../../common-utils/template-resolver";
import {BaseControlValueAccessorV2} from "../../base/base-control-value-accessor-v2";

@Component({
  selector: 'app-dropdown',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    BaseInputComponent,
    NgClass,
    HumanizeFormMessagesPipe,
    CdkConnectedOverlay,
    AppSvgIconComponent
  ],
  templateUrl: './dropdown.component.html',
  styleUrl: './dropdown.component.scss'
})
export class DropdownComponent<T> extends BaseControlValueAccessorV2<any> implements AfterContentInit, OnChanges {

  cdr = inject(ChangeDetectorRef);
  renderer = inject(Renderer2);
  overlay = inject(Overlay);

  title = input<string | null>();
  items = input<T[]>([]);
  placeholder = input<string>('Select');
  prefixIconPath = input<string | null>();
  isTitlePrefix = input<boolean>(false);
  display = input<string | null>();
  displayTemplate = input<string | null>();
  value = input<string | null>();
  searchKeyMatch = input<string | null>();
  // identifier = input<string>();
  noDataMessage = input<string>();
  state = input<State<any>>();
  fullWidth = input<boolean>(false);
  showErrorSpace = input<boolean>(false);
  enableSearch = input<boolean>(false);
  addActionText = input<string | null>();
  minimumPopupWidth = input(250);
  noBorder = input<boolean>(false);

  isOpen = signal(false);
  highlightedIndex = signal(-1);
  selectedItem = signal<T | null>(null);
  dropUp = signal(false);
  dropdownWidth = signal(300);
  filteredList = signal<T[]>([]);
  errorMessages = signal<{ [key: string]: string }>({});

  valueChanged = output<T | null>();
  addActionClicked = output<void>();

  @ViewChild('dropdownButton', {static: true}) dropdownButton!: ElementRef;
  @ViewChild('dropdown', {static: true}) dropdown!: ElementRef;
  @ViewChild('dropdownListContainer', {static: false}) dropdownListContainer!: ElementRef;
  @ViewChild('dropdownList', {static: false}) dropdownList!: ElementRef;
  private searchField = viewChild<ElementRef<HTMLInputElement>>('searchField');

  scrollStrategy = this.overlay.scrollStrategies.block();

  ngOnChanges(changes: SimpleChanges): void {
    let value = this.actualValue;
    if (value != null) {
      if (this.value() != null) {
        let matchingItem = this.getObjectByPathValue(this.items(), this.value()!, value);
        this.selectedItem.set(matchingItem ?? null);
      } else {
        this.selectedItem.set(value);
      }
    }
  }

  protected onValueReady(value: any): void {
    if (value != null) {
      if (this.value() != null) {
        let matchingItem = this.getObjectByPathValue(this.items(), this.value()!, value);
        this.selectedItem.set(matchingItem ?? null);
      } else {
        this.selectedItem.set(value);
      }
    } else {
      this.selectedItem.set(null);
    }
  }

  ngAfterContentInit(): void {
    let formControl = this.ngControl?.control as FormControl;
    if (formControl) {
      this.formControl = this.ngControl?.control as FormControl;
    }
  }

  getDisplayString(item: T | null): any {

    let object = item as any;
    if (object == null) {
      return null;
    }

    if (this.display() != null && this.display() != '') {
      return this.display()!.split('.').reduce((acc, part) => acc && acc[part], object);
    }

    if (this.displayTemplate() != null && this.displayTemplate() != '') {
      return resolveTemplateWithObject(object, this.displayTemplate()!);
    }

    return item;

  }

  getButtonClass(): string {
    if (this.noBorder()) {
      return 'border-none outline-none ring-none';
    } else {
      return 'border-none outline-none border-gray-300 ring-1 focus:ring-2 ring-neutral-300 focus:ring-primary-500 shadow-1 focus:border-none focus:outline-none';
    }
  }

  filterList(event: Event) {
    const searchKeyword = (event.target as HTMLInputElement)?.value;

    if (this.enableSearch()) {
      this.updateFilteredList(searchKeyword);
    } else {
      const firstMatchingItem = this.findFirstMatch(searchKeyword);
      let index = this.filteredList().findIndex(item => item == firstMatchingItem);
      this.highlightedIndex.set(index);
    }
  }

  updateFilteredList(searchKeyword?: string) {

    if (!searchKeyword || searchKeyword.trim() === '') {
      return;
    }

    const filterResult = this.items().filter((item) => {
      const displayString = this.getDisplayString(item);
      if (typeof displayString === 'string') {
        return displayString.toLowerCase().includes(searchKeyword.toLowerCase());
      }
      return false;
    });

    this.filteredList.set(filterResult);
    this.updateHighlightedIndex();
  }

  findFirstMatch(searchKeyword?: string): T | null {
    if (!searchKeyword || searchKeyword.trim() === '') {
      return null;
    }
    return this.filteredList().find((item) => {
      const displayString = this.getDisplayString(item);
      if (typeof displayString === 'string') {
        return displayString.toLowerCase().includes(searchKeyword.toLowerCase());
      }
      return false;
    }) || null;
  }

  getValue(item: T): any {
    if (this.value() == null || this.value() == '') {
      return item;
    }
    let object = item as any;
    return this.value()!.split('.').reduce((acc, part) => acc && acc[part], object);
  }

  getSelectedItem(): T | null {
    let items = this.filteredList() ?? [];
    let selectedItem = items.find(item => this.getValue(item) == this.formControl.value);
    return selectedItem ?? this.selectedItem() ?? null;
  }

  toggleDropdown(): void {
    this.isOpen.update(prev => !prev);
    if (this.isOpen()) {
      this.filteredList.set(this.items());
      this.updateHighlightedIndex();
      this.adjustDropdownPosition();
      this.setPopupWidth();
      this.cdr.detectChanges();
      this.setDropdownMaxHeight();
      this.scrollToHighlightedItem();
      this.searchField()?.nativeElement.focus();
    }
  }

  updateHighlightedIndex() {
    let index = this.filteredList().findIndex(item => item == this.selectedItem());
    this.highlightedIndex.set(index);
  }

  setPopupWidth() {
    const buttonWidth = this.dropdownButton.nativeElement.offsetWidth;
    if (buttonWidth < this.minimumPopupWidth()) {
      this.dropdownWidth.set(this.minimumPopupWidth());
      return;
    }

    this.dropdownWidth.set(this.dropdownButton.nativeElement.offsetWidth);
  }

  onClickOutside() {
    this.isOpen.set(false);
    this.dropdown?.nativeElement.focus();
  }

  onItemClicked(item: T): void {
    this.onClickOutside();
    this.selectedItem.set(item);
    if (this.formControl.enabled) {
      this.markAsTouched();
      const value = this.getValue(item);
      if (value == this.formControl.value) {
        this.onChange(value);
        this.valueChanged.emit(null);
      } else {
        this.onChange(value);
        this.valueChanged.emit(item);
      }
    }
  }

  setDropdownMaxHeight() {
    const buttonRect = this.dropdownButton.nativeElement.getBoundingClientRect();
    const spaceBelow = window.innerHeight - buttonRect.bottom;
    const spaceAbove = buttonRect.top;

    let maxHeight;
    if (this.dropUp()) {
      maxHeight = spaceAbove - 36;
    } else {
      maxHeight = spaceBelow - 36;
    }

    if (this.dropdownListContainer) {
      this.renderer.setStyle(this.dropdownListContainer.nativeElement, 'max-height', `${maxHeight}px`);
    }
  }

  adjustDropdownPosition() {
    const buttonRect = this.dropdownButton.nativeElement.getBoundingClientRect();
    const spaceBelow = window.innerHeight - buttonRect.bottom;
    const spaceAbove = buttonRect.top;
    this.dropUp.set(spaceAbove > spaceBelow && spaceBelow < 200);
  }

  scrollToHighlightedItem() {
    if (this.dropdownList && this.dropdownList.nativeElement.children[this.highlightedIndex()]) {
      const highlightedItem = this.dropdownList.nativeElement.children[this.highlightedIndex()];
      highlightedItem.scrollIntoView({block: 'nearest'});
    }
  }

  @HostListener('window:resize')
  onResize() {
    if (this.isOpen()) {
      this.adjustDropdownPosition();
    }
  }

  handleKeydown(event: KeyboardEvent) {
    if (!this.isOpen()) {
      return;
    }
    switch (event.key) {
      case 'ArrowDown':
        if (this.highlightedIndex() < this.filteredList().length - 1) {
          this.highlightedIndex.update(prev => prev + 1);
        }
        this.scrollToHighlightedItem();
        event.preventDefault();
        break;
      case 'ArrowUp':
        if (this.highlightedIndex() > 0) {
          this.highlightedIndex.update(prev => prev - 1);
        }
        this.scrollToHighlightedItem();
        event.preventDefault();
        break;
      case 'Enter':
        this.onItemClicked(this.filteredList()[this.highlightedIndex()]);
        this.isOpen.set(false);
        event.preventDefault();
        break;
      case 'Escape':
        this.isOpen.set(false);
        event.preventDefault();
        break;
    }


    if (!this.enableSearch()) {
      let key = event.key;
      if (key.length === 1 && /^[a-zA-Z]$/.test(key)) {
        const matchingIndex = this.filteredList().findIndex(item => {
            let resolvedText = '';
            if (this.searchKeyMatch() != null && this.searchKeyMatch() != '') {
              resolvedText = resolveTemplateWithObject(item as any, `$${this.searchKeyMatch()}`);
            } else {
              resolvedText = this.getDisplayString(item);
            }
            return resolvedText.toLowerCase().startsWith(key);
          }
        );

        if (matchingIndex !== -1) {
          this.highlightedIndex.set(matchingIndex);
          this.scrollToHighlightedItem()
        }
      }
    }
  }

  onClearSearchClicked() {
    if (this.searchField()) {
      this.searchField()!.nativeElement.value = '';
      this.filteredList.set(this.items());
      this.highlightedIndex.set(0);
      this.scrollToHighlightedItem();
      this.searchField()!.nativeElement.focus();
    }
  }

  onAddActionClicked() {
    this.addActionClicked.emit();
  }

  getObjectByPathValue(objects: any[], path: string, value: any): T | null {
    const pathParts = path.split('.');
    if(objects == null) {
      return null;
    }

    return objects.find((obj) => {
      let current = obj;
      for (const part of pathParts) {
        if (current && part in current) {
          current = current[part];
        } else {
          return false;
        }
      }
      return current === value;
    });
  }
}
