import {
  Component,
  ElementRef,
  AfterViewInit,
  ViewChild,
  OnDestroy,
} from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';

interface InputValue {
  value: string;
  isValid: boolean;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit, OnDestroy {
  title = 'two-number-division';
  @ViewChild('input1', { static: true }) input1!: ElementRef;
  @ViewChild('input2', { static: true }) input2!: ElementRef;
  inputValue1: InputValue = { value: '', isValid: false };
  inputValue2: InputValue = { value: '', isValid: false };
  result?: number;
  jsonUtil = JSON;
  keyupSubscriptions: Subscription[] = [];

  ngAfterViewInit() {
    [this.input1, this.input2].map((input: ElementRef) => {
      const subscription = fromEvent<KeyboardEvent>(
        input.nativeElement,
        'keyup'
      )
        .pipe(debounceTime(500), distinctUntilChanged())
        .subscribe((event: KeyboardEvent) => {
          const inputEl = <HTMLInputElement>event.target;
          const isValid = !!inputEl.value && !isNaN(+inputEl.value);
          const inputValue: InputValue = { value: inputEl.value, isValid };
          if (inputEl.id === '1') {
            this.inputValue1 = inputValue;
          } else {
            this.inputValue2 = inputValue;
          }
          this.calculateResult();
        });
      this.keyupSubscriptions.push(subscription);
    });
  }

  calculateResult() {
    this.result = undefined;
    if (this.inputValue1.isValid && this.inputValue2.isValid) {
      this.result =
        parseFloat(this.inputValue1.value) / parseFloat(this.inputValue2.value);
    }
  }

  ngOnDestroy() {
    this.keyupSubscriptions.map((s) => s.unsubscribe());
  }
}
