import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { KeyValuePipe } from '@angular/common';

@Component({
    selector: 'app-input',
    imports: [ReactiveFormsModule, LucideAngularModule, KeyValuePipe],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
    <div class="flex flex-col gap-1.5 w-full">
        <!-- Label & Popup Info -->
        <div class="flex items-center gap-2 mb-1">
          <label
            [for]="id()"
            class="text-sm font-medium ml-1 text-slate-700"
          >
            {{ label() }}
          </label>
          @if (description()) {
            <div class="group/tooltip relative flex items-center justify-center cursor-help">
              <lucide-icon name="info" class="w-4 h-4 text-slate-400 hover:text-blue-600 transition-colors" />
              <!-- Tooltip -->
              <div class="absolute left-1/2 bottom-full mb-2 -translate-x-1/2 w-48 p-2 bg-slate-900 text-white text-xs rounded-lg shadow-xl opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all duration-200 z-50 pointer-events-none text-center">
                {{ description() }}
                <div class="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-slate-900"></div>
              </div>
            </div>
          }
        </div>

      <!-- Input Wrapper -->
      <div class="relative group">
        <!-- Prefix Icon/Text -->
        @if (prefix()) {
          <span
            class="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none font-medium transition-colors text-slate-400 group-focus-within:text-blue-600"
          >
            {{ prefix() }}
          </span>
        }

        <input
          [id]="id()"
          [type]="type()"
          [placeholder]="placeholder()"
          [formControl]="control()"
          (focus)="focused.emit()"
          (blur)="blurred.emit()"
          class="w-full h-10 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 font-medium shadow-sm outline-none transition-all placeholder:text-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:bg-slate-50 disabled:text-slate-500"
          [class.pl-10]="prefix()"
          [class.pl-4]="!prefix()"
          [class.pr-10]="suffix()"
          [class.pr-4]="!suffix()"
          [class.border-red-300]="hasError()"
          [class.focus:border-red-500]="hasError()"
          [class.focus:ring-red-500]="hasError()"
        />

        <!-- Suffix Icon/Text -->
        @if (suffix()) {
          <span
            class="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none font-medium transition-colors text-slate-400 group-focus-within:text-blue-600"
          >
            {{ suffix() }}
          </span>
        }
      </div>

      <!-- Error Message -->
      @if (hasError()) {
        <div class="text-[11px] text-red-600 font-bold mt-1 px-1 flex items-center gap-1 animate-in fade-in slide-in-from-top-1">
          <lucide-icon name="alert-circle" class="w-3 h-3" />
          @if (control().errors; as errors) {
            @for (error of errors | keyvalue; track $index) {
              <span>{{ error.key }}</span>
            }
          }
        </div>
      }
    </div>
  `
})
export class InputComponent {
    readonly id = input.required<string>();
    readonly label = input<string>();
    readonly description = input<string>();
    readonly placeholder = input<string>('');
    readonly type = input<'text' | 'number'>('text');

    // Can be text or generic content, for now just text
    readonly prefix = input<string>();
    readonly suffix = input<string>();

    readonly control = input.required<FormControl>();

    readonly focused = output<void>();
    readonly blurred = output<void>();

    // Derived state
    protected hasError(): boolean {
        return this.control().invalid && this.control().touched;
    }
}
