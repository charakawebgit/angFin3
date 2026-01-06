import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { describe, it, expect } from 'vitest';

@Component({
    template: '<div>Zoneless Works</div>',
    standalone: true
})
class TestComponent { }

describe('Sanity Check (Zoneless)', () => {
    it('should render component with provideZonelessChangeDetection', async () => {
        TestBed.configureTestingModule({
            imports: [TestComponent],
            providers: [provideZonelessChangeDetection()]
        });

        const fixture = TestBed.createComponent(TestComponent);
        await fixture.whenStable();

        expect(fixture.nativeElement.textContent).toContain('Zoneless Works');
    });
});
