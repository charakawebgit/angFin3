# Angular v21 Testing Standard Guidelines

This report summarizes the testing standards and guidelines for Angular v21, focusing on **Zoneless** applications, **Signals**, and **Vitest**, based on the official Angular documentation.

## 1. Zoneless Testing

When testing applications that use `provideExperimentalZonelessChangeDetection` (or the stable `provideZonelessChangeDetection` in v21), `TestBed` configuration requires specific providers to ensure component compatibility.

### Configuration
Configure `TestBed` with the zoneless provider to match your application's bootstrap configuration.

```typescript
import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';

TestBed.configureTestingModule({
  providers: [
    provideZonelessChangeDetection() 
  ]
});
```

### Change Detection Strategy
In a zoneless environment, avoid relying on `fixture.detectChanges()` to force updates. Instead, allow Angular's scheduler to handle state synchronization.

*   **Preferred**: `await fixture.whenStable();`
    *   Waits for all pending tasks and microtasks to complete.
    *   Ensures the test environment mimics production behavior.
*   **Avoid**: `fixture.detectChanges()` (unless necessary for migrating legacy tests).

### Debugging & Verification
To verify that your components are truly zoneless-compatible (i.e., they don't rely on `Zone.js` to detect changes), you can enable exhaustive checking:

```typescript
import { provideCheckNoChangesConfig } from '@angular/core';

TestBed.configureTestingModule({
  providers: [
    provideZonelessChangeDetection(),
    provideCheckNoChangesConfig({ exhaustive: true })
  ]
});
```
This will throw `ExpressionChangedAfterItHasBeenCheckedError` if bindings update without a proper notification (signal set, `markForCheck`, or async pipe).

## 2. Testing Signals

Angular v21 introduces new helpers for testing Signal Inputs and Outputs directly in `TestBed`.

### Binding Inputs
You can bind values to signal inputs (`input()`) when creating the component fixture.

```typescript
import { inputBinding } from '@angular/core';

const fixture = TestBed.createComponent(MyComponent, {
  bindings: [
    inputBinding('myInput', 'testValue')
  ]
});
```
This is cleaner than manually setting the signal or input property after creation.

## 3. Async Testing with Vitest

Since `Zone.js` is removed, the traditional `fakeAsync` and `tick` utilities (which depend on Zone.js) should be replaced with native async/await and your test runner's timer mocking capabilities.

### Using Vitest Fake Timers
The documentation recommends using Vitest's `vi` utility for controlling time.

```typescript
it('should handle async operations', async () => {
  vi.useFakeTimers();

  // Trigger action
  component.startTimer();

  // Fast-forward time
  await vi.runAllTimersAsync();
  
  // Verify result
  expect(component.isDone).toBe(true);

  vi.useRealTimers();
});
```

## 4. Key Takeaways for angFin3

1.  **Remove `Zone.js` dependencies**: Ensure `test-setup.ts` and `vitest.config.ts` do not import or rely on `zone.js` or `zone.js/testing`.
2.  **Use `whenStable()`**: Update tests to `await fixture.whenStable()` instead of calling `detectChanges()` multiple times.
3.  **Leverage Signals**: Use `inputBinding` for cleaner component tests.
4.  **Vitest Native**: Use `vi.useFakeTimers()` for async logic instead of Angular's `fakeAsync`.

## 5. Lessons Learned & Configuration

During the implementation of these standards in `angFin3`, several critical configuration requirements were identified:

### Vitest & AnalogJS Plugin
For Vitest to correctly compile Angular components (especially those using Signals and newer syntax), the `@analogjs/vite-plugin-angular` is **mandatory**.

*   **vitest.config.ts**:
    ```typescript
    import angular from '@analogjs/vite-plugin-angular';
    export default defineConfig({
      plugins: [angular()],
      // ...
    });
    ```
    *Note: It is a default export.*

### Path Aliases in Testing
`tsconfig.spec.json` must explicitly verify or inherit `paths` from `tsconfig.json`. Ensure the `files` or `include` array covers `src/test-setup.ts`.

### Signal Input Testing
While `inputBinding` is promising, the most robust way to test Signal Inputs in v21 currently is finding the `componentRef` and setting the input directly:

```typescript
fixture = TestBed.createComponent(MyComponent);
fixture.componentRef.setInput('myInput', 'value');
await fixture.whenStable();
```

### Mock Data Validity
When using `provideIcons` or other global registries, ensuring your mock data uses **valid keys** is crucial. Invalid keys (e.g., using 'test' instead of a real icon name) can cause runtime failures in the test runner even if compilation succeeds.

## 6. What to Avoid

When adopting these modern testing standards, explicitly avoid the following outdated patterns:

### 1. Avoid `fixture.detectChanges()`
In zoneless testing, this method forces a change detection run that may conflict with the natural scheduler. **Do not use it** to trigger updates unless you are specifically testing migration scenarios. rely on `await fixture.whenStable()`.

### 2. Avoid `fakeAsync` and `tick()`
These utilities are tightly coupled with `Zone.js`. Using them in a zoneless environment will lead to unpredictable behavior or test failures. Use **Vitest's native timer mocks** (`vi.useFakeTimers()`, `vi.advanceTimersByTime()`) instead.

### 3. Avoid Jasmine Globals
If you are using Vitest, avoid `jasmine.createSpy()` or `jasmine.clock()`. Use the `vi` utility (`vi.fn()`, `vi.spyOn()`) to ensure compatibility and leverage Vitest's performance.

### 4. Avoid Over-configured TestBeds
Do not import `BrowserAnimationsModule` or `NoopAnimationsModule` unless absolutely necessary. Zoneless setup often handles animation frames differently. Usually, providing the specific component and necessary providers is sufficient.

### 5. Avoid Manual Signal Writes for Inputs
Do not attempt to write to a signal input property directly (e.g., `component.id.set('val')` - this will fail as inputs are read-only). Always use `fixture.componentRef.setInput()`.
