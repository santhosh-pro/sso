import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'callback',
        pathMatch: 'full',
    },
    {
        path: 'home',
        loadComponent: () => import('./home/home.component').then(m => m.HomeComponent),
        title: 'Home',
    },
    {
        path: 'callback',
        loadComponent: () => import('./callback/callback.component').then(m => m.CallbackComponent),
        title: 'Callback',
    }
];
