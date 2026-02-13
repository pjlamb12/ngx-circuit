import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CircuitDirective } from './circuit.directive';
import { CircuitService } from '../circuit-service/circuit.service';
import { signal } from '@angular/core';

@Component({
  template: `
    <div *cktCircuit="'featureA'">Feature A Content</div>
    <div *cktCircuit="'featureB'; else fallback">Feature B Content</div>
    <ng-template #fallback>Fallback Content</ng-template>
  `,
  imports: [CircuitDirective],
  standalone: true,
})
class TestComponent {}

describe('CircuitDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let mockCircuitService: any;
  let flagsSignal: any;

  beforeEach(() => {
    flagsSignal = signal({ featureA: true, featureB: false });

    mockCircuitService = {
      isEnabled: (feature: string) => flagsSignal()[feature] === true,
    };

    TestBed.configureTestingModule({
      imports: [TestComponent, CircuitDirective],
      providers: [{ provide: CircuitService, useValue: mockCircuitService }],
    });

    fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
  });

  it('should render content when flag is enabled', () => {
    const element: HTMLElement = fixture.nativeElement;
    expect(element.textContent).toContain('Feature A Content');
  });

  it('should not render content when flag is disabled', () => {
    const element: HTMLElement = fixture.nativeElement;
    expect(element.textContent).not.toContain('Feature B Content');
  });

  it('should render fallback content when flag is disabled and else template is provided', () => {
    const element: HTMLElement = fixture.nativeElement;
    expect(element.textContent).toContain('Fallback Content');
  });

  it('should react to flag changes', () => {
    const element: HTMLElement = fixture.nativeElement;

    // Disable Feature A
    flagsSignal.set({ featureA: false, featureB: false });
    fixture.detectChanges();
    expect(element.textContent).not.toContain('Feature A Content');

    // Enable Feature B
    flagsSignal.set({ featureA: false, featureB: true });
    fixture.detectChanges();
    expect(element.textContent).toContain('Feature B Content');
    expect(element.textContent).not.toContain('Fallback Content');
  });
});
