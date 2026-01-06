import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./pages/home/ui/home-page.component').then(m => m.HomePageComponent)
    },
    {
        path: 'calculator/:id',
        loadComponent: () => import('./pages/calculator/ui/calculator-page.component').then(m => m.CalculatorPageComponent)
    },
    {
        path: '**',
        redirectTo: ''
    }
];
