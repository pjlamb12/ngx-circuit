import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EnvironmentsListComponent } from './environments-list.component';
import { EnvironmentsService } from '@circuit-breaker/data-access/environments';
import { of } from 'rxjs';

describe('EnvironmentsListComponent', () => {
  let component: EnvironmentsListComponent;
  let fixture: ComponentFixture<EnvironmentsListComponent>;
  let mockEnvironmentsService: {
    getEnvironments: jest.Mock;
    createEnvironment: jest.Mock;
    deleteEnvironment: jest.Mock;
    createApiKey: jest.Mock;
    deleteApiKey: jest.Mock;
  };

  beforeEach(async () => {
    mockEnvironmentsService = {
      getEnvironments: jest.fn().mockReturnValue(of([])),
      createEnvironment: jest.fn(),
      deleteEnvironment: jest.fn(),
      createApiKey: jest.fn(),
      deleteApiKey: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [EnvironmentsListComponent],
      providers: [
        { provide: EnvironmentsService, useValue: mockEnvironmentsService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EnvironmentsListComponent);
    component = fixture.componentInstance;
    component.applicationId = 'test-app-id';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load environments on init', () => {
    expect(mockEnvironmentsService.getEnvironments).toHaveBeenCalledWith(
      'test-app-id',
    );
  });
});
