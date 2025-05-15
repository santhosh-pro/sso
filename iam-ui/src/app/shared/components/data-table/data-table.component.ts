import {
  AfterViewInit,
  Component,
  ContentChildren,
  inject,
  input,
  output,
  OutputEmitterRef,
  OutputRefSubscription,
  QueryList,
  signal,
  Type,
  ViewChild
} from '@angular/core';
import { PaginationComponent, PaginationEvent } from '../pagination/pagination.component';
import { ShimmerComponent } from '../shimmer/shimmer.component';
import { DatePipe, NgClass } from '@angular/common';
import { AppSvgIconComponent } from '../app-svg-icon/app-svg-icon.component';
import { StatusBadgeComponent } from '../status-badge/status-badge.component';
import { SortableTableDirective, TableSortEvent } from './base-table/sortable-table.directive';
import { TableResizableColumnsDirective } from './base-table/table-resizable-columns.directive';
import { Overlay, OverlayConfig } from '@angular/cdk/overlay';
import { CdkPortal } from '@angular/cdk/portal';
import { FormsModule, FormControl, ReactiveFormsModule } from '@angular/forms';
import { TextButtonSmall } from '../text-button-small/text-button-small.component';
import { DynamicRendererComponent } from '../dynamic-renderer/dynamic-renderer.component';
import { BaseControlValueAccessorV3 } from '../../core/base-control-value-accessor-v3';
import { DateInputComponent, InputDateFormat } from '../input/date-input/date-input.component';
import { State } from '@shared/core/base-state';
import { NoDataTableComponent } from './no-data-table/no-data-table.component';
import { resolveTemplateWithObject } from '@shared/core/template-resolver';
import { TextInputComponent } from '../input/text-input/text-input.component';
import { CheckboxComponent } from '../checkbox/checkbox.component';
import { ContextMenuButtonAction, ContextMenuButtonComponent } from '../context-menu-button/context-menu-button.component';
import { MultiSelectDropdownComponent } from '../multi-select-dropdown/multi-select-dropdown.component';

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [
    PaginationComponent,
    NoDataTableComponent,
    ShimmerComponent,
    NgClass,
    DatePipe,
    AppSvgIconComponent,
    ContextMenuButtonComponent,
    StatusBadgeComponent,
    SortableTableDirective,
    TableResizableColumnsDirective,
    CdkPortal,
    CheckboxComponent,
    FormsModule,
    TextInputComponent,
    TextButtonSmall,
    DynamicRendererComponent,
    MultiSelectDropdownComponent,
    ReactiveFormsModule,
    DateInputComponent
  ],
  templateUrl: './data-table.component.html',
  styleUrl: './data-table.component.scss',
})
export class DataTableComponent<T> extends BaseControlValueAccessorV3<TableStateEvent> implements AfterViewInit {
  @ContentChildren('filter') headerComponents!: QueryList<any>;

  // Expose InputDateFormat enum to the template
  public InputDateFormat = InputDateFormat;

  columnGroups = input.required<ColumnGroup[]>();
  state = input.required<State<any>>();
  pageSize = input(50);
  enableHorizontallyScrollable = input(false);
  enableResizableColumns = input(false);
  enableClickableRows = input(false);
  expandableComponent = input<any>();
  enableColumnsConfig = input(false);
  filterComponent = input<any>();
  enableSearch = input(true);
  disableInitialLoad = input(false);

  pageChange = output<PaginationEvent>();
  sortChanged = output<TableSortEvent>();
  tableStateChanged = output<TableStateEvent>();
  onActionPerformed = output<TableActionEvent>();
  filterChanged = output<FilterEvent>();
  onRowClicked = output<any>();

  subscriptions: OutputRefSubscription[] = [];

  overlay = inject(Overlay);
  @ViewChild(CdkPortal) portal!: CdkPortal;

  paginationEvent?: PaginationEvent;
  tableSortEvent?: TableSortEvent;
  searchText: string = '';
  columnFilters: { [key: string]: { value?: any; min?: any; max?: any; operation: string } } = {};
  filterControls: { [key: string]: { [prop: string]: FormControl } } = {};

  ngAfterViewInit(): void {
    // Initialize columnFilters for all columns with filterConfig
    this.columnGroups().forEach(group => {
      group.columns.forEach(column => {
        if (column.filterConfig) {
          const filterKey = this.getFilterKey(column);
          if (!this.columnFilters[filterKey]) {
            this.columnFilters[filterKey] = {
              operation: this.getDefaultOperation(column.filterConfig.type)
            };
          }
        }
      });
    });

    let paginationEvent: PaginationEvent = {
      pageNumber: 1,
      pageSize: this.pageSize()
    };
    this.pageChange.emit(paginationEvent);

    let tableStateEvent: TableStateEvent = {
      searchText: '',
      paginationEvent: paginationEvent,
      tableSortEvent: this.tableSortEvent,
      columnFilters: this.columnFilters
    };

    if (!this.disableInitialLoad()) {
      this.tableStateChanged.emit(tableStateEvent);
      console.log('Initial table state:', tableStateEvent);
    }

    this.onValueChange(tableStateEvent);

    this.headerComponents.forEach((component) => {
      if (component.filtersChanged) {
        let emitter: OutputEmitterRef<any> = component.filtersChanged;
        const sub = emitter.subscribe((newFilters: any) => {
          this.filterChanged.emit({ key: 'custom', value: newFilters, operation: 'custom' });
          console.log('Custom filter changed:', { key: 'custom', value: newFilters, operation: 'custom' });
        });
        this.subscriptions.push(sub);
      }
    });
  }

  protected override onValueReady(value: TableStateEvent): void {}

  onColumnSettingsClicked(columnsConfigTriggerElement: HTMLDivElement) {
    const config = new OverlayConfig({
      positionStrategy: this.overlay
        .position()
        .flexibleConnectedTo(columnsConfigTriggerElement)
        .withPositions([
          {
            originX: 'start',
            originY: 'bottom',
            overlayX: 'end',
            overlayY: 'top',
            offsetX: 20,
            offsetY: 10,
          }
        ]),
      hasBackdrop: true,
      backdropClass: ['bg-black', 'bg-opacity-0', 'shadow-1']
    });

    const overlayRef = this.overlay.create(config);
    overlayRef.attach(this.portal);

    overlayRef.backdropClick().subscribe(() => overlayRef.detach());
  }

  onSearchTextChanged($event: string) {
    this.searchText = $event;
    let paginationEvent: PaginationEvent = {
      pageNumber: 1,
      pageSize: this.pageSize()
    };
    let tableStateEvent: TableStateEvent = {
      searchText: this.searchText,
      paginationEvent: paginationEvent,
      tableSortEvent: this.tableSortEvent,
      columnFilters: this.columnFilters
    };
    this.tableStateChanged.emit(tableStateEvent);
    console.log('Search text changed:', tableStateEvent);
    this.onValueChange(tableStateEvent);
  }

  getFilterKey(column: ColumnDef): string {
    return column.key || column.sortKey || (column.displayTemplate?.replace(/^\$/, '') || '');
  }

  getFilterValue(column: ColumnDef, property: 'min' | 'max' | 'value'): any {
    const filterKey = this.getFilterKey(column);
    return this.columnFilters[filterKey]?.[property];
  }

  getFilterControl(column: ColumnDef, property: 'min' | 'max' | 'value'): FormControl {
    const filterKey = this.getFilterKey(column);
    if (!this.filterControls[filterKey]) {
      this.filterControls[filterKey] = {};
    }
    if (!this.filterControls[filterKey][property]) {
      const initialValue = this.getFilterValue(column, property) || null;
      if (column.filterConfig?.type === 'date' && initialValue) {
        const dateValue = new Date(initialValue);
        this.filterControls[filterKey][property] = new FormControl(this.isValidDate(dateValue) ? dateValue : null);
      } else {
        this.filterControls[filterKey][property] = new FormControl(initialValue);
      }
      // Subscribe to value changes for debugging
      this.filterControls[filterKey][property].valueChanges.subscribe(value => {
        console.log(`Filter control (${filterKey}, ${property}) changed:`, value);
      });
    }
    return this.filterControls[filterKey][property];
  }

  private isValidDate(date: any): boolean {
    return date instanceof Date && !isNaN(date.getTime());
  }

  onFilterChanged(min: any, max: any, column: ColumnDef) {
    console.log('onFilterChanged called with:', { min, max, column: column.title });

    const filterKey = this.getFilterKey(column);
    if (!filterKey) {
      console.warn('No valid filter key found for column:', column.title);
      return;
    }

    const existingFilter = this.columnFilters[filterKey] || {
      operation: this.getDefaultOperation(column.filterConfig?.type),
    };
    const operation = existingFilter.operation;

    let parsedMin = min;
    let parsedMax = max;
    if (column.filterConfig?.type === 'date') {
      parsedMin = min ? new Date(min) : null;
      parsedMax = max ? new Date(max) : null;
      parsedMin = parsedMin && this.isValidDate(parsedMin) ? parsedMin : null;
      parsedMax = parsedMax && this.isValidDate(parsedMax) ? parsedMax : null;
      console.log('Parsed date values:', { parsedMin, parsedMax });
    }

    this.columnFilters[filterKey] = operation === 'range'
      ? { min: parsedMin, max: parsedMax, operation }
      : { value: parsedMin, operation };

    const filterEvent: FilterEvent = operation === 'range'
      ? { key: filterKey, min: parsedMin, max: parsedMax, operation }
      : { key: filterKey, value: parsedMin, operation };

    console.log('Emitting filterChanged:', filterEvent);
    this.filterChanged.emit(filterEvent);

    let paginationEvent: PaginationEvent = {
      pageNumber: 1,
      pageSize: this.pageSize()
    };
    let tableStateEvent: TableStateEvent = {
      searchText: this.searchText,
      paginationEvent: paginationEvent,
      tableSortEvent: this.tableSortEvent,
      columnFilters: this.columnFilters
    };

    console.log('Emitting tableStateChanged:', tableStateEvent);
    this.tableStateChanged.emit(tableStateEvent);
    this.onValueChange(tableStateEvent);
  }

  onFilterOperationChanged(operation: string, column: ColumnDef) {
    console.log('onFilterOperationChanged called with:', { operation, column: column.title });

    const filterKey = this.getFilterKey(column);
    if (!filterKey) {
      console.warn('No valid filter key found for column:', column.title);
      return;
    }

    const existingFilter = this.columnFilters[filterKey] || {
      value: null,
      min: null,
      max: null,
      operation: this.getDefaultOperation(column.filterConfig?.type)
    };

    this.columnFilters[filterKey] = operation === 'range'
      ? { min: existingFilter.min, max: existingFilter.max, operation }
      : { value: existingFilter.value, operation };

    if (this.filterControls[filterKey]) {
      if (operation === 'range') {
        this.filterControls[filterKey]['value']?.setValue(null, { emitEvent: false });
      } else {
        this.filterControls[filterKey]['min']?.setValue(null, { emitEvent: false });
        this.filterControls[filterKey]['max']?.setValue(null, { emitEvent: false });
      }
    }

    const filterEvent: FilterEvent = operation === 'range'
      ? { key: filterKey, min: existingFilter.min, max: existingFilter.max, operation }
      : { key: filterKey, value: existingFilter.value, operation };
    console.log('Emitting filterChanged (operation):', filterEvent);
    this.filterChanged.emit(filterEvent);

    let paginationEvent: PaginationEvent = {
      pageNumber: 1,
      pageSize: this.pageSize()
    };
    let tableStateEvent: TableStateEvent = {
      searchText: this.searchText,
      paginationEvent: paginationEvent,
      tableSortEvent: this.tableSortEvent,
      columnFilters: this.columnFilters
    };
    console.log('Emitting tableStateChanged (operation):', tableStateEvent);
    this.tableStateChanged.emit(tableStateEvent);
    this.onValueChange(tableStateEvent);
  }

  public getDefaultOperation(type?: string): string {
    switch (type) {
      case 'text':
        return 'contains';
      case 'number':
      case 'date':
        return 'equal';
      default:
        return 'contains';
    }
  }

  public getFilterOperations(type?: string): { value: string; label: string }[] {
    switch (type) {
      case 'text':
        return [
          { value: 'contains', label: 'Contains' },
          { value: 'exact', label: 'Exact' }
        ];
      case 'number':
      case 'date':
        return [
          { value: 'greaterThan', label: 'Greater Than' },
          { value: 'lesserThan', label: 'Lesser Than' },
          { value: 'equals', label: 'Equals' },
          { value: 'notEqual', label: 'Not Equal' },
          { value: 'range', label: 'Range' },
        ];
      default:
        return [];
    }
  }

  onColumnVisibleOrHide($event: boolean, column: ColumnDef) {
    column.visible = $event;
  }

  onSelectAllColumnClicked() {
    this.columnGroups().forEach(group => {
      group.columns.forEach(column => {
        column.visible = true;
      });
    });
  }

  getPropertyValue(item: any, column: ColumnDef): any {
    if (column.displayTemplate) {
      return resolveTemplateWithObject(item, column.displayTemplate);
    }

    let value = '';

    if (column.key) {
      value = column.key.split('.').reduce((acc, part) => acc && acc[part], item);
    }

    if (column.formatter) {
      return column.formatter ? column.formatter(value) : value;
    } else if (column.objectFormatter) {
      return column.objectFormatter ? column.objectFormatter(item) : item;
    } else {
      return value;
    }
  }

  onPageChange(event: PaginationEvent) {
    let tableStateEvent: TableStateEvent = {
      searchText: this.searchText,
      paginationEvent: event,
      tableSortEvent: this.tableSortEvent,
      columnFilters: this.columnFilters
    };
    this.pageChange.emit(event);
    this.tableStateChanged.emit(tableStateEvent);
    console.log('Page changed:', tableStateEvent);
    this.onValueChange(tableStateEvent);
  }

  onSortChanged(event: TableSortEvent) {
    let tableStateEvent: TableStateEvent = {
      searchText: this.searchText,
      paginationEvent: {
        pageNumber: 1,
        pageSize: this.pageSize()
      },
      tableSortEvent: event,
      columnFilters: this.columnFilters
    };
    this.sortChanged.emit(event);
    this.tableStateChanged.emit(tableStateEvent);
    console.log('Sort changed:', tableStateEvent);
    this.onValueChange(tableStateEvent);
  }

  getThTrClass(column: ColumnDef) {
    switch (column.alignment) {
      case 'left':
        return 'text-left';
      case 'center':
        return 'text-center';
      case 'right':
        return 'text-right';
      default:
        return 'text-left';
    }
  }

  getFlexJustify(column: ColumnDef) {
    switch (column.alignment) {
      case 'left':
        return 'justify-start';
      case 'center':
        return 'justify-center';
      case 'right':
        return 'justify-end';
      default:
        return 'justify-start';
    }
  }

  getBadgeProperty(item: any, column: ColumnDef): BadgeConfigProperty | null {
    let badgeConfigProperties = column.badgeConfig?.properties ?? [];
    let matchedBadgeConfigProperty: BadgeConfigProperty | null = null;

    badgeConfigProperties.forEach(badgeConfigProperty => {
      let value = this.getPropertyValue(item, column);
      if (value === badgeConfigProperty.data) {
        matchedBadgeConfigProperty = badgeConfigProperty;
      }
    });
    return matchedBadgeConfigProperty;
  }

  getContextMenuActions(actions: ContextMenuActionConfig[] | ((item: any) => ContextMenuActionConfig[]) | null | undefined, item: any): ContextMenuButtonAction[] {
    let actionConfigs: ContextMenuActionConfig[] = [];

    if (typeof actions === 'function') {
      actionConfigs = actions(item);
    } else if (actions) {
      actionConfigs = actions;
    }

    return actionConfigs.map(action => {
      let configAction: ContextMenuButtonAction = {
        iconPath: action.iconPath,
        label: action.label,
        actionKey: action.actionKey
      };
      return configAction;
    });
  }

  _onActionClicked($event: string, item: any, mouseEvent: MouseEvent | null) {
    if (mouseEvent) {
      mouseEvent.stopPropagation();
    }
    let tableActionEvent: TableActionEvent = {
      actionKey: $event,
      item: item
    };
    this.onActionPerformed.emit(tableActionEvent);
    console.log('Action clicked:', tableActionEvent);
  }

  expandedRowIndex = signal<number | null>(null);

  onRowExpandedClicked(i: number) {
    if (this.expandedRowIndex() == i) {
      this.expandedRowIndex.set(null);
    } else {
      this.expandedRowIndex.set(i);
    }
  }

  _onRowClicked(item: any) {
    this.onRowClicked.emit(item);
  }

  onCellActionPerformed($event: TableActionEvent) {
    this.onActionPerformed.emit($event);
    console.log('Cell action performed:', $event);
  }

  onRowActionPerformed($event: TableActionEvent) {
    this.onActionPerformed.emit($event);
    console.log('Row action performed:', $event);
  }
}

export interface ColumnGroup {
  title: string;
  columns: ColumnDef[];
}

export interface ColumnDef {
  title: string;
  key?: string;
  displayTemplate?: string;
  sortKey?: string;
  alignment?: 'left' | 'center' | 'right';
  type: 'text' | 'date' | 'badge' | 'custom' | 'actions';
  pinned?: 'left' | 'right' | null;
  visible?: boolean | null;
  component?: Type<any>;
  textConfig?: TextConfig;
  dateConfig?: DateConfig;
  badgeConfig?: BadgeConfig;
  customConfig?: CustomRendererConfig;
  actionsConfig?: ActionConfig;
  formatter?: (value: any) => any;
  objectFormatter?: (value: any) => any;
  propertyStyle?: (value: any) => any;
  filterConfig?: FilterConfig;
}

export interface TextConfig {
  textColorClass?: string;
}

export interface DateConfig {
  dateFormat?: string;
  showIcon?: boolean;
}

export interface BadgeConfig {
  properties: BadgeConfigProperty[];
}

export interface BadgeConfigProperty {
  data: string;
  displayText: string;
  backgroundColorClass?: string;
  borderColorClass?: string;
  textColorClass?: string;
  indicatorColorClass?: string;
}

export interface CustomRendererConfig {
  data?: any;
}

export interface ActionConfig {
  iconActions?: IconAction[];
  threeDotMenuActions?: ContextMenuActionConfig[] | null | ((item: any) => ContextMenuActionConfig[]);
  textMenuActions?: ContextMenuActionConfig[] | null;
  components?: Type<any>[];
}

export interface IconAction {
  iconPath: string;
  actionKey: string;
  label?: string;
}

export interface ContextMenuActionConfig {
  iconPath?: string;
  actionKey: string;
  label: string;
}

export interface TableActionEvent {
  actionKey: string;
  item: any;
  data?: any;
}

export interface TableStateEvent {
  searchText: string;
  paginationEvent?: PaginationEvent;
  tableSortEvent?: TableSortEvent;
  columnFilters?: { [key: string]: { value?: any; min?: any; max?: any; operation: string } };
}

export interface FilterEvent {
  key: string;
  value?: any;
  min?: any;
  max?: any;
  operation: string;
}

export interface FilterConfig {
  type: 'text' | 'number' | 'date' | 'select' | 'multi-select';
  placeholder?: string;
  options?: { value: any; label: string }[];
  dateFormat?: 'mm/dd/yyyy' | 'dd/MM/yyyy';
  operation?: 'contains' | 'exact' | 'greaterThan' | 'lesserThan' | 'equal' | 'notEqual' | 'range';
  enableMinMax?: boolean;
}