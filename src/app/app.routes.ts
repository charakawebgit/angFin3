import { Routes } from '@angular/router';

/**
 * Application route configuration.
 * Uses lazy-loaded components for optimal bundle splitting.
 */
export const routes: Routes = [
    {
        path: '',
        title: 'Financial Calculators',
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
] as const;
