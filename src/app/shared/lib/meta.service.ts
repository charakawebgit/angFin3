import { Injectable, inject } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';

/**
 * Service for managing document title and meta tags.
 * Integrates with TitleStrategy for route-based title updates.
 */
@Injectable({
    providedIn: 'root',
})
export class MetaService {
    private readonly title = inject(Title);
    private readonly meta = inject(Meta);
    private readonly defaultTitle = 'angFin';
    private readonly defaultDescription = 'Professional Financial Calculators and Investment Tools';

    /**
     * Updates the document title with the application name suffix.
     */
    updateTitle(title: string | undefined): void {
        const t = title && title.length ? `${title} | ${this.defaultTitle}` : this.defaultTitle;
        this.title.setTitle(t);
    }

    /**
     * Updates the meta description tag.
     */
    updateMeta(description: string | undefined): void {
        const desc = description || this.defaultDescription;
        this.meta.updateTag({ name: 'description', content: desc });
    }

    /**
     * Resets title and meta to default values.
     */
    resetTitle(): void {
        this.title.setTitle(this.defaultTitle);
        this.updateMeta(this.defaultDescription);
    }
}
