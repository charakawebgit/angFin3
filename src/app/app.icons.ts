import { icons } from 'lucide-angular';
import { importProvidersFrom } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';

/**
 * Lucide icon registry for the application.
 * Only icons used in templates are included for optimal tree-shaking.
 * Add new icons here as needed.
 */
const APP_ICONS = {
    Search: icons.Search,
    ArrowRight: icons.ArrowRight,
    ArrowLeft: icons.ArrowLeft,
    SearchX: icons.SearchX,
    Coins: icons.Coins,
    BookOpen: icons.BookOpen,
    Lightbulb: icons.Lightbulb,
    FunctionSquare: icons.SquareFunction,
    Sigma: icons.Sigma,
    ArrowUpRight: icons.ArrowUpRight,
    Trash2: icons.Trash2,
    Info: icons.Info,
    ChevronDown: icons.ChevronDown,
    AlertCircle: icons.CircleAlert,
    Check: icons.Check,
    Copy: icons.Copy,
    MoreHorizontal: icons.Ellipsis
} as const;

/**
 * Provider function for Lucide icons.
 * Use in app.config.ts providers array.
 */
export function provideIcons() {
    return importProvidersFrom(LucideAngularModule.pick(APP_ICONS));
}
