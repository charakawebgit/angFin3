import { ApplicationConfig, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding, TitleStrategy } from '@angular/router';
import { AppTitleStrategy } from '@shared/lib/title-strategy';
import { provideIcons } from './app.icons';

import { routes } from './app.routes';

/**
 * Root application configuration.
 * 
 * Features:
 * - Zoneless change detection for better performance
 * - Component input binding for route parameters
 * - Custom title strategy for dynamic page titles
 * - Optimized icon tree-shaking
 */
export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter(routes, withComponentInputBinding()),
    provideIcons(),
    { provide: TitleStrategy, useClass: AppTitleStrategy }
  ]
};
