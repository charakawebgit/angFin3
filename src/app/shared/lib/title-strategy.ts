import { Injectable, inject } from '@angular/core';
import { TitleStrategy, RouterStateSnapshot } from '@angular/router';
import { MetaService } from './meta.service';
import { CALCULATOR_REGISTRY } from '@entities/calculator/model/registry';

@Injectable({
    providedIn: 'root'
})
export class AppTitleStrategy extends TitleStrategy {
    private readonly metaService = inject(MetaService);

    override updateTitle(routerState: RouterStateSnapshot): void {
        const url = routerState.url.split('?')[0];
        const parts = url.split('/');
        const id = parts[parts.length - 1];

        if (id && url.includes('/calculator/')) {
            const cfg = CALCULATOR_REGISTRY.find(c => c.id === id);
            if (cfg) {
                this.metaService.updateTitle(cfg.title);
                this.metaService.updateMeta(cfg.description);
                return;
            }
        }

        const title = this.buildTitle(routerState);
        if (title) {
            this.metaService.updateTitle(title);
            return;
        }

        this.metaService.resetTitle();
    }
}
