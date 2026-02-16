import { TestBed } from '@angular/core/testing';
import { App } from './app';
import { provideRouter } from '@angular/router';
import { RuntimeConfigLoaderService } from 'runtime-config-loader';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: RuntimeConfigLoaderService,
          useValue: {
            getConfig: () => ({
              apiBaseUrl: 'http://localhost:3000',
            }),
          },
        },
      ],
    }).compileComponents();

    const mockLocalStorage = {
      getItem: () => null,
      setItem: () => {
        // mock
      },
      removeItem: () => {
        // mock
      },
      clear: () => {
        // mock
      },
    };

    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage,
    });
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'circuit-breaker'`, () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    // @ts-expect-error access protected property
    expect(app.title).toEqual('circuit-breaker');
  });

  it('should render router-outlet', () => {
    const fixture = TestBed.createComponent(App);
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('router-outlet')).toBeTruthy();
  });
});
