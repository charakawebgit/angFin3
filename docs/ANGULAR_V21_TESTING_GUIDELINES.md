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
