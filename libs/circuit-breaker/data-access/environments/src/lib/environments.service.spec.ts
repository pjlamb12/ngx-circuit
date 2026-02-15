import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { EnvironmentsService } from './environments.service';
import { RuntimeConfigLoaderService } from 'runtime-config-loader';

describe('EnvironmentsService', () => {
  let service: EnvironmentsService;
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
        EnvironmentsService,
        {
          provide: RuntimeConfigLoaderService,
          useValue: mockConfigLoader,
        },
      ],
    });
    service = TestBed.inject(EnvironmentsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get environments', () => {
    const mockEnvironments = [{ id: '1', name: 'Dev', key: 'dev' }];
    const appId = 'app-1';

    service.getEnvironments(appId).subscribe((envs) => {
      expect(envs).toEqual(mockEnvironments);
    });

    const req = httpMock.expectOne(
      'http://localhost:3000/api/environments?applicationId=app-1',
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockEnvironments);
  });

  it('should create environment', () => {
    const newEnv = { name: 'Prod', key: 'prod' };
    const createdEnv = { ...newEnv, id: '2' };

    service.createEnvironment(newEnv).subscribe((env) => {
      expect(env).toEqual(createdEnv);
    });

    const req = httpMock.expectOne('http://localhost:3000/api/environments');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newEnv);
    req.flush(createdEnv);
  });

  it('should delete environment', () => {
    const envId = '1';

    service.deleteEnvironment(envId).subscribe();

    const req = httpMock.expectOne(
      `http://localhost:3000/api/environments/${envId}`,
    );
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('should create api key', () => {
    const envId = '1';
    const name = 'test-key';
    const createdKey = { id: 'key-1', name, key: 'abc' };

    service.createApiKey(envId, name).subscribe((key) => {
      expect(key).toEqual(createdKey);
    });

    const req = httpMock.expectOne(
      `http://localhost:3000/api/environments/${envId}/api-keys`,
    );
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ name });
    req.flush(createdKey);
  });

  it('should delete api key', () => {
    const keyId = 'key-1';

    service.deleteApiKey(keyId).subscribe();

    const req = httpMock.expectOne(
      `http://localhost:3000/api/environments/api-keys/${keyId}`,
    );
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
