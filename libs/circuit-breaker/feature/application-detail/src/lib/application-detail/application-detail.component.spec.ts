import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ApplicationDetailComponent } from './application-detail.component';
import { ApplicationsService } from '@circuit-breaker/data-access/applications';
import { FlagsService } from '@circuit-breaker/data-access/flags';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('ApplicationDetailComponent', () => {
  let component: ApplicationDetailComponent;
  let fixture: ComponentFixture<ApplicationDetailComponent>;

  const mockApplicationsService = {
    getApplication: jest.fn().mockReturnValue(
      of({
        id: '1',
        name: 'App 1',
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    ),
  };

  const mockFlagsService = {
    getFlags: jest.fn().mockReturnValue(of([])),
    createFlag: jest.fn(),
    updateFlag: jest.fn(),
    deleteFlag: jest.fn(),
  };

  const mockActivatedRoute = {
    paramMap: of({ get: () => '1' }),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApplicationDetailComponent],
      providers: [
        { provide: ApplicationsService, useValue: mockApplicationsService },
        { provide: FlagsService, useValue: mockFlagsService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ApplicationDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load application and flags on init', () => {
    expect(mockApplicationsService.getApplication).toHaveBeenCalledWith('1');
    expect(mockFlagsService.getFlags).toHaveBeenCalledWith('1');
  });
});
