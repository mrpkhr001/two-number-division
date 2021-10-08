import { TestBed, tick, fakeAsync } from '@angular/core/testing';

import { Subscription } from 'rxjs';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppComponent],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'two-number-division'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('two-number-division');
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled: HTMLElement = fixture.nativeElement;
    expect(compiled.querySelector('.content h4')?.textContent).toContain(
      'two-number-division app is running!'
    );
  });

  it('should calculate result when two numbers are valid', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    app.inputValue1 = { value: '234', isValid: true };
    app.inputValue2 = { value: '14', isValid: true };
    app.calculateResult();
    expect(app.result).toBe(234 / 14);
  });
  it('should not calculate result when one of the number is not valid', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    app.inputValue1 = { value: '234', isValid: true };
    app.inputValue2 = { value: '2s3sd12', isValid: false };
    app.calculateResult();
    expect(app.result).toBeUndefined();
  });

  it('should unsubscribe the events once the app is destroyed', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    const fakeSubscription: Subscription = jasmine.createSpyObj<Subscription>(
      'Subscription',
      ['unsubscribe']
    );
    app.keyupSubscriptions = [fakeSubscription];
    app.ngOnDestroy();
    expect(fakeSubscription.unsubscribe).toHaveBeenCalled();
  });

  it('should show error message for invalid input 1', fakeAsync(() => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled: HTMLElement = fixture.nativeElement;
    const input1: HTMLInputElement =
      compiled.querySelector('.firstInput input')!;
    input1.value = 'abc';
    input1.dispatchEvent(new Event('keyup'));
    tick(400);
    fixture.detectChanges();
    expect(compiled.querySelector('.firstInput .error')).toBeNull();
    tick(100);
    fixture.detectChanges();
    expect(compiled.querySelector('.firstInput .error')?.textContent).toEqual(
      'Invalid number'
    );
  }));

  it('should show error message for invalid input 2', fakeAsync(() => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled: HTMLElement = fixture.nativeElement;
    const input2: HTMLInputElement =
      compiled.querySelector('.secondInput input')!;
    input2.value = '234s3232ds2';
    input2.dispatchEvent(new Event('keyup'));
    tick(400);
    fixture.detectChanges();
    expect(compiled.querySelector('.secondInput .error')).toBeNull();
    tick(100);
    fixture.detectChanges();
    expect(compiled.querySelector('.secondInput .error')?.textContent).toEqual(
      'Invalid number'
    );
  }));

  it('should show result when two numbers are valid', fakeAsync(() => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled: HTMLElement = fixture.nativeElement;
    const inputs = [500, 50];
    const inputSelectors = ['.firstInput input', '.secondInput input'];
    inputSelectors.map((selector, index) => {
      const input: HTMLInputElement = compiled.querySelector(selector)!;
      input.value = inputs[index].toString();
      input.dispatchEvent(new Event('keyup'));
    });

    tick(400);
    fixture.detectChanges();
    expect(compiled.querySelector('.result')?.textContent).toBe('');
    tick(100);
    fixture.detectChanges();
    expect(compiled.querySelector('.result')?.textContent).toEqual(
      (inputs[0] / inputs[1]).toString()
    );
  }));
});
