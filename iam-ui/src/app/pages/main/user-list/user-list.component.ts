import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '@core/api/api.service';
import { GetUserListItem, GetUserListParams, GetUserListResponse } from '@core/api/model';
import { AuthHelperService } from '@core/auth-helper.service';
import { BaseComponent } from 'src/app/shared/base/base-component';
import { State } from 'src/app/shared/base/base-state';
import { ColumnGroup, FilterEvent, TableActionEvent, TableStateEvent, DataTableComponent, ContextMenuActionConfig } from 'src/app/shared/components/data-table/data-table.component';
import { OverlayService } from 'src/app/shared/components/overlay/overlay.service';
import { ButtonComponent } from "../../../shared/components/button/button.component";
import { CreateUserComponent } from './create-user/create-user.component';

@Component({
  selector: 'app-user-list',
  imports: [DataTableComponent, FormsModule, ButtonComponent],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css'
})
export class UserListComponent extends BaseComponent implements OnInit {
  tableState = signal<TableStateEvent | null>(null);
  applicationState = new State<GetUserListResponse>();
  apiService = inject(ApiService);
  overlayService = inject(OverlayService);
  authHelperService = inject(AuthHelperService);



  ngOnInit(): void {
  }

  onCreate() {
  console.log('Create button clicked');
    const dialogRef = this.overlayService.openModal(CreateUserComponent, {
      disableClose: true,
    });
    dialogRef.closed.subscribe(() => {
      this.getUserList(this.tableState()!, true);
    });
  }

  getUserList(event: TableStateEvent, filterChanged: boolean = false) {
    const request: GetUserListParams = {
      pageNumber: filterChanged ? 1 : event?.paginationEvent?.pageNumber ?? 1,
      pageSize: filterChanged ? 50 : event?.paginationEvent?.pageSize ?? 50,
      search: event.searchText,
    };
    this.executeRequest<GetUserListResponse>({
      state: this.applicationState,
      request: this.apiService.getUserList(request),
      handleSuccess: false,
      handleError: true,
    });
  }

  columnGroups: ColumnGroup[] = [
    {
      title: '',
      columns: [
        {
          title: 'First Name',
          type: 'text',
          alignment: 'left',
          displayTemplate: '$firstName',
          sortKey: 'firstName',
        },
        {
          title: 'Last Name',
          type: 'text',
          alignment: 'left',
          displayTemplate: '$lastName',
          sortKey: 'lastName',
        },
        {
          title: 'Email',
          type: 'text',
          alignment: 'left',
          displayTemplate: '$email',
          sortKey: 'email',
        },
        {
          title: 'Role',
          type: 'text',
          alignment: 'left',
          displayTemplate: '$roleName',
          sortKey: 'roleId'
        },
        {
          title: 'Phone Number',
          type: 'text',
          alignment: 'left',
          displayTemplate: '$phoneNumber',
          sortKey: 'phoneNumber',
        },
        {
          title: 'Actions',
          type: 'actions',
          alignment: 'center',
          actionsConfig: {
            threeDotMenuActions: (): ContextMenuActionConfig[] => {
              return [
                {
                    label: 'Enable',
                    iconPath: 'icons/account.svg',
                    actionKey: 'enable'
                  },
                  {
                    label: 'Disable',
                    iconPath: 'icons/delete.svg',
                    actionKey: 'disable'
                  },
                  {
                    label: 'Edit',
                    iconPath: 'icons/edit.svg',
                    actionKey: 'edit'
                  },
              ];
            }
          }
        }
      ]
    },
  ];

  onTableStateChanged(event: TableStateEvent) {
    console.log('Table state changed:', event);
  }

  onFilterChanged(event: FilterEvent) {
   console.log('Filter changed:', event);
  }

  onRowClicked(item: any) {
    console.log('Row clicked:', item);
  }


  async onAction(event: TableActionEvent) {
    console.log('Action event:', event);
    let item: GetUserListItem = event.item;
    console.log('Action key:', event.actionKey);

    switch (event.actionKey) {
      case 'enable':
        this.overlayService.openAlert('Enable!', 'Are you sure you want to enable the Application Request?').then((confirmed) => {
          if (confirmed) {
            this.executeRequest({
              state: this.applicationState,
              request: this.apiService.enableUser(item.id),
              handleSuccess: true,
              onSuccess: (response) => {
                this.getUserList(this.tableState()!, true);
              }
            });
          }
        });
        break;

      case 'disable':
        this.overlayService.openAlert('Disable!', 'Are you sure you want to disable the Application Request?').then((confirmed) => {
          if (confirmed) {
            this.executeRequest({
              state: this.applicationState,
              request: this.apiService.disableUser(item.id),
              handleSuccess: true,
              onSuccess: (response) => {
                this.getUserList(this.tableState()!, true);
              }
            });
          }
        });
        break;
      case 'edit':
        break;

      default:
        console.log('Unknown action key:', event.actionKey);
        break;
    }
  }
}
