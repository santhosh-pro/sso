import {AfterContentInit, Component, inject, input, OnChanges, output, signal, SimpleChanges} from '@angular/core';
import {BaseInputComponent} from "../_base/base-input/base-input.component";
import {BaseControlValueAccessor} from "../../base/base-control-value-accessor";
import {State} from "../../base/base-state";
import {FormControl, NgControl} from "@angular/forms";
import {HumanizeFormMessagesPipe} from "../humanize-form-messages.pipe";
import {ShimmerComponent} from "../../components/shimmer/shimmer.component";
import {NgClass, NgStyle} from "@angular/common";
import {AppSvgIconComponent} from "../../components/app-svg-icon/app-svg-icon.component";
import {deepEqual, jsonEqual} from "../_utils/base-input-utils";
import {resolveTemplateWithObject} from "../../common-utils/template-resolver";
import {SharedConstants} from '../../shared-constants';

@Component({
  selector: 'app-multi-selection-field',
  standalone: true,
  imports: [
    BaseInputComponent,
    HumanizeFormMessagesPipe,
    ShimmerComponent,
    NgClass,
    AppSvgIconComponent,
    NgStyle
  ],
  templateUrl: './multi-selection-field.component.html',
  styleUrl: './multi-selection-field.component.scss'
})
export class MultiSelectionFieldComponent<T> extends BaseControlValueAccessor implements AfterContentInit, OnChanges {
  title = input<string | null>();
  items = input<T[]>([]);
  display = input<string | null>();
  displayTemplate = input<string | null>();
  iconSrc = input<string | null>();
  dynamicIconPath = input<string>();
  imageUrl = input<string | null>();
  dynamicImageUrlPath = input<string>();
  value = input<string | null>(null);
  identifier = input<string>(SharedConstants.inputIdentifier);
  noDataMessage = input<string>();
  state = input<State<any>>();
  iconColor = input<string>();
  dynamicIconColor = input<string>();
  customActionText = input<string>();
  fullWidth = input<boolean>(false);
  itemWidth = input<number | null>(null);
  isItemCentered = input<boolean>(false);
  showSelectionTickMark = input<boolean>(true);
  maximumDisplayItems = input<number | null>(null);

  valueChanged = output<T[]>();
  onCustomActionClicked = output<void>();

  showAll = signal(false);

  selectedItems = signal<T[]>([]);
  errorMessages = signal<{ [key: string]: string }>({});

  ngControl = inject(NgControl, {optional: true, self: true});

  constructor() {
    super();
    if (this.ngControl) {
      this.ngControl!.valueAccessor = this;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.updateValue();
  }

  override onWriteValue(value: any[]): void {
    this.updateValue();
  }

  updateValue() {
    let formValue = this.formControl.value ?? [];
    if (formValue == null) {
      return;
    }

    if (!Array.isArray(formValue)) {
      return;
    }

    let items = formValue.map(x => {
      let item = this.getObjectUsingIdentifierValue(x);
      return item;
    });

    this.selectedItems.set(items);
  }

  ngAfterContentInit(): void {
    let formControl = this.ngControl?.control as FormControl;
    if (formControl) {
      this.formControl = this.ngControl?.control as FormControl;
      if (this.formControl.value == null) {
        this.formControl.setValue([]);
      }
      if(!Array.isArray(this.formControl.value)){
        this.formControl.setValue([]);
      }
    }
  }

  getVisibleItems(): T[] {
    if (this.showAll()) return this.items();
    return this.maximumDisplayItems() !== null ? this.items().slice(0, this.maximumDisplayItems()!) : this.items();
  }

  showMoreButton(): boolean {
    return !this.showAll() && this.maximumDisplayItems() !== null && this.items().length > this.maximumDisplayItems()!;
  }

  showLessButton(): boolean {
    return this.showAll() && this.maximumDisplayItems() !== null;
  }

  showAllItems() {
    this.showAll.set(true);
  }

  shrinkItems() {
    this.showAll.set(false);
  }

  getObjectUsingValue(selectedItem: T): any {
    if (this.value() == null || this.value() == '') {
      return selectedItem;
    }

    let valuePath = this.value()!;
    return this.items().find(item => {
      const propertyValue = valuePath.split('.').reduce((acc, part) => acc && acc[part], item as any);
      return propertyValue === this.getValue(selectedItem);
    });
  }

  getObjectUsingIdentifier(selectedItem: T): T | undefined {
    if (this.identifier() == null || this.identifier() == '') {
      return selectedItem;
    }
    let identifierPath = this.identifier()!;
    return this.items().find(item => {
      const propertyValue = identifierPath.split('.').reduce((acc, part) => acc && acc[part], item as any);
      return propertyValue === this.getIdentifier(selectedItem);
    });
  }

  getObjectUsingIdentifierValue(value: any): any | undefined {
    if (this.identifier() == null || this.identifier() == '') {
      return value;
    }
    let identifierPath = this.identifier()!;
    return this.items().find(item => {
      const propertyValue = identifierPath.split('.').reduce((acc, part) => acc && acc[part], item as any);
      return propertyValue === value;
    });
  }

  getDisplayString(item: T): any {
    let object = item as any;
    if(object == null) {
      return null;
    }

    if(this.display() != null && this.display() != '') {
      return this.display()!.split('.').reduce((acc, part) => acc && acc[part], object);
    }

    if(this.displayTemplate() != null && this.displayTemplate() != '') {
      return resolveTemplateWithObject(object, this.displayTemplate()!);
    }

    return item;
  }

  getValue(item: T): any {
    if (!this.value()) {
      return item;
    }
    let object = item as any;
    return this.value()!.split('.').reduce((acc, part) => acc && acc[part], object);
  }

  getAllValues(): any[] {
    let items = this.selectedItems() ?? [];
    let values = items.map((item: T) => this.getValue(item));
    return values;
  }

  getIdentifier(item: T): any {
    if (!this.identifier()) {
      return item;
    }
    let object = item as any;
    let identifier = this.identifier()!.split('.').reduce((acc, part) => acc && acc[part], object);
    return identifier;
  }

  isItemExistInFormControl(item: T) {
    const controlValue = (this.formControl.value as T[]) ?? [];
    let identifierPath = this.identifier() ?? '';
    let value = this.getIdentifier(item);


    let anyMatch = controlValue.some(x => x == value);
    if (anyMatch) {
      return true;
    }

    if (identifierPath == null || identifierPath == '') {
      return controlValue.some(x => deepEqual(x, item));
    }
    let isEqual = controlValue.find(x => {
      const propertyValue = identifierPath.split('.').reduce((acc, part) => acc && acc[part], x as any);
      return propertyValue === this.getIdentifier(item);
    });
    return isEqual;
  }

  isItemExistInNormalSelectionList(item: T) {
    const controlValue = (this.selectedItems()) ?? [];
    let identifierPath = this.identifier()!;
    if (identifierPath == null || identifierPath == '') {
      return controlValue.some(x => deepEqual(x, item));
    }
    let isEqual = controlValue.find(x => {
      const propertyValue = identifierPath.split('.').reduce((acc, part) => acc && acc[part], x as any);
      return propertyValue === this.getIdentifier(item);
    });
    return isEqual;
  }

  onItemClicked(item: T) {
    this.markAsTouched();

    const controlValue = (this.formControl.value as T[]) ?? [];
    const valueExistInFormControl = this.isItemExistInFormControl(item);
    const valueExistInSelections = this.isItemExistInNormalSelectionList(item);


    if (valueExistInFormControl || valueExistInSelections) {
      const index = controlValue.indexOf(item);
      controlValue.splice(index, 1);
      this.selectedItems.update(prev => {
        let index = prev.findIndex(x => deepEqual(x, item));
        prev.splice(index, 1);
        return prev;
      });
      let value = this.getAllValues();
      this.valueChanged.emit(value);
      this.onChange(value);
    } else {
      controlValue.push(item);
      this.selectedItems.update(prev => {
        prev.push(item);
        return prev;
      });
      let value = this.getAllValues();
      this.valueChanged.emit(value);
      this.onChange(value);
    }
  }

  getImageType(item: T): 'svg' | 'url' | null {

    if (this.iconSrc() != null && this.iconSrc() != '') {
      return 'svg';
    }

    if (this.dynamicIconPath() != null && this.dynamicIconPath() != '') {
      return 'svg';
    }

    if (this.imageUrl() != null && this.imageUrl() != '') {
      return 'url';
    }

    if (this.dynamicImageUrlPath() != null && this.dynamicImageUrlPath() != '') {
      return 'url';
    }

    return null;
  }

  getDynamicIcon(item: T): string | null | undefined {
    if (this.iconSrc() != null && this.iconSrc() != '') {
      return this.iconSrc();
    }

    if (this.dynamicIconPath() != null && this.dynamicIconPath() != '') {
      let object = item as any;
      return this.dynamicIconPath()!.split('.').reduce((acc, part) => acc && acc[part], object);
    }

    if (this.imageUrl() != null && this.imageUrl() != '') {
      return this.imageUrl();
    }

    if (this.dynamicImageUrlPath() != null && this.dynamicImageUrlPath() != '') {
      let object = item as any;
      return this.dynamicImageUrlPath()!.split('.').reduce((acc, part) => acc && acc[part], object);
    }

    return null;
  }

  getDynamicIconColor(item: T): string | null | undefined {
    if (this.iconColor()) {
      return this.iconColor();
    }

    if (this.dynamicIconColor() == null || this.dynamicIconColor() == '') {
      return this.iconColor();
    }
    let object = item as any;
    const color = this.dynamicIconColor()!.split('.').reduce((acc, part) => acc && acc[part], object);
    return color;
  }

  customActionClicked() {
    this.onCustomActionClicked.emit();
  }

  handleKeydown(event: KeyboardEvent, item: T) {
    switch (event.key) {
      case 'Enter':
        this.onItemClicked(item);
        event.preventDefault();
        break;
    }
  }
}
