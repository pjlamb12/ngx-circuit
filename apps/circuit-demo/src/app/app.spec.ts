import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { CircuitService } from 'ngx-circuit';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideRouter([]),
        {
          provide: CircuitService,
          useValue: {
            isEnabled: () => true,
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            init: () => {},
            // Add other methods if needed by the component or directive during test
          },
        },
      ],
    }).compileComponents();
  });

  it('should render title', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h2')?.textContent).toContain(
      'Welcome to the Demo!',
    );
  });
});
