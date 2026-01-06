import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideIcons } from '@app/app.icons';
import { CalculatorPageComponent } from './calculator-page.component';
import { CalculatorService } from '@entities/calculator/model/calculator.service';
import { CalculatorConfig } from '@entities/calculator/model/types';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('CalculatorPageComponent', () => {
    let fixture: ComponentFixture<CalculatorPageComponent>;
    let component: CalculatorPageComponent;
    let serviceMock: any;

    const mockConfig: CalculatorConfig = {
        id: 'test-calc',
        title: 'Test Calculator',
        description: 'Testing purposes',
        category: 'Test',
        icon: 'Calculator', // Valid icon key
        fields: [],
        results: [],
        formula: () => ({}),
        resultFormat: () => ''
    };

    beforeEach(async () => {
        serviceMock = {
            getById: vi.fn().mockReturnValue(mockConfig),
            setActive: vi.fn(),
            clearActive: vi.fn(),
        };

        await TestBed.configureTestingModule({
            imports: [CalculatorPageComponent],
            providers: [
                provideZonelessChangeDetection(),
                provideRouter([]),
                provideIcons(),
                { provide: CalculatorService, useValue: serviceMock }
            ]
        }).compileComponents();
    });

    it('should create', () => {
        fixture = TestBed.createComponent(CalculatorPageComponent);
        component = fixture.componentInstance;
        expect(component).toBeTruthy();
    });

    it('should load config when id input changes', async () => {
        fixture = TestBed.createComponent(CalculatorPageComponent);

        // Set signal input
        fixture.componentRef.setInput('id', 'test-calc');

        // Wait for zoneless change detection and effects
        await fixture.whenStable();

        // Verify service interaction
        expect(serviceMock.getById).toHaveBeenCalledWith('test-calc');
        expect(serviceMock.setActive).toHaveBeenCalledWith(mockConfig);
    });
});
