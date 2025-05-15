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
        title: 'Home',
        children: [
            {
                path: '',
                loadComponent:() => import('./pages/main/user-list/user-list.component').then(m => m.UserListComponent),
            }
        ]
    },
    {
        path: 'callback',
        loadComponent: () => import('./core/callback/callback.component').then(m => m.CallbackComponent)
    }
];
