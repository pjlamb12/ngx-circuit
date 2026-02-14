import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { FlagsService } from './flags.service';
import { RuntimeConfigLoaderService } from 'runtime-config-loader';

describe('FlagsService', () => {
  let service: FlagsService;
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
        FlagsService,
        { provide: RuntimeConfigLoaderService, useValue: mockConfigLoader },
      ],
    });
    service = TestBed.inject(FlagsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get flags', () => {
    const mockFlags = [
      { id: '1', key: 'test', applicationId: 'app-1', defaultValue: true },
    ];
    const appId = 'app-1';

    service.getFlags(appId).subscribe((flags) => {
      expect(flags).toEqual(mockFlags);
    });

    const req = httpMock.expectOne(
      `http://localhost:3000/api/flags?applicationId=${appId}`,
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockFlags);
  });

  it('should create flag', () => {
    const newFlag = { key: 'new', applicationId: 'app-1', defaultValue: false };
    const createdFlag = { id: '2', ...newFlag };

    service.createFlag(newFlag).subscribe((flag) => {
      expect(flag).toEqual(createdFlag);
    });

    const req = httpMock.expectOne('http://localhost:3000/api/flags');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newFlag);
    req.flush(createdFlag);
  });
});
