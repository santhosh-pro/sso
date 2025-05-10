import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'login',
        loadComponent: () => import('./login/login.component').then(m => m.LoginComponent)
    },
    {
        path: 'callback',
        loadComponent: () => import('./callback/callback.component').then(m => m.CallbackComponent)
    }
];
