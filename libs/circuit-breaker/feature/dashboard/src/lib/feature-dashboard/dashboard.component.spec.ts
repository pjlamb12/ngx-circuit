import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { ApplicationsService } from '@circuit-breaker/data-access/applications';
import { of } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  const mockApplicationsService = {
    getApplications: jest.fn().mockReturnValue(of([])),
    createApplication: jest.fn().mockReturnValue(of({})),
    deleteApplication: jest.fn().mockReturnValue(of({})),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardComponent, NoopAnimationsModule],
      providers: [
        { provide: ApplicationsService, useValue: mockApplicationsService },
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load applications on init', () => {
    expect(mockApplicationsService.getApplications).toHaveBeenCalled();
  });

  it('should open create modal', () => {
    component.openCreateModal();
    expect(component.showCreateModal()).toBe(true);
  });
});
