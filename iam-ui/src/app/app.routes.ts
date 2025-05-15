import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'callback',
        pathMatch: 'full'
    },
    {
        path: 'login',
        loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent)
    },
    {
        path: 'main',
        loadComponent: () => import('./pages/main/main.component').then(m => m.MainComponent),
        children: [
            {
                path: '',
                loadComponent: () => import('./pages/main/user-list/user-list.component').then(m => m.UserListComponent),
                // children: [
                //     {
                //         path: 'create',
                //         loadComponent: () =>
                //             import('./pages/main/user-list/create-user/create-user-model.component')
                //                 .then(m => m.CreateUserModelComponent)
                //     }
                // ]
            },
            {
                path:'create',
                loadComponent: () =>
                    import('./pages/main/user-list/create-user/create-user.component')
                        .then(m => m.CreateUserComponent)
            }
        ]
    },
    {
        path: 'callback',
        loadComponent: () => import('./core/callback/callback.component').then(m => m.CallbackComponent)
    }
];
