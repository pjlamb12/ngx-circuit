import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { ApplicationsService } from './applications.service';
import { RuntimeConfigLoaderService } from 'runtime-config-loader';

describe('ApplicationsService', () => {
  let service: ApplicationsService;
  let httpMock: HttpTestingController;

  const mockConfigLoader = {
    getConfig: jest
      .fn()
      .mockReturnValue({ apiBaseUrl: 'http://localhost:3000/api' }),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ApplicationsService,
        { provide: RuntimeConfigLoaderService, useValue: mockConfigLoader },
      ],
    });
    service = TestBed.inject(ApplicationsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get applications', () => {
    const dummyApps = [{ id: '1', name: 'App 1' }];
    service.getApplications().subscribe((apps) => {
      expect(apps.length).toBe(1);
      expect(apps).toEqual(dummyApps);
    });

    const req = httpMock.expectOne('http://localhost:3000/api/applications');
    expect(req.request.method).toBe('GET');
    req.flush(dummyApps);
  });

  it('should create application', () => {
    const newApp = { name: 'New App' };
    const returnedApp = { id: '1', ...newApp };
    service.createApplication(newApp).subscribe((app) => {
      expect(app).toEqual(returnedApp);
    });

    const req = httpMock.expectOne('http://localhost:3000/api/applications');
    expect(req.request.method).toBe('POST');
    req.flush(returnedApp);
  });
});
