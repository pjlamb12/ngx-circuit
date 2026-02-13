import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { CircuitService } from './circuit.service';
import {
  provideCircuitConfig,
  CircuitConfig,
  CircuitType,
} from '../circuit.config';
import { provideCircuitContext } from '../circuit-context/circuit.context';

describe('CircuitService', () => {
  let service: CircuitService;
  let httpMock: HttpTestingController;

  describe('with object config', () => {
    const mockConfig: CircuitConfig = {
      featureA: true,
      featureB: false,
    };

    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          provideHttpClient(),
          provideHttpClientTesting(),
          CircuitService,
          provideCircuitConfig(mockConfig),
        ],
      });
      service = TestBed.inject(CircuitService);
      httpMock = TestBed.inject(HttpTestingController);
    });

    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should initialize flags from config object', () => {
      expect(service.flags()).toEqual(mockConfig);
    });

    it('should correctly check if feature is enabled', () => {
      expect(service.isEnabled('featureA')).toBe(true);
      expect(service.isEnabled('featureB')).toBe(false);
      expect(service.isEnabled('featureC')).toBe(false);
    });
  });

  describe('with advanced config', () => {
    const mockConfig: CircuitConfig = {
      timeBasedFeature: {
        type: CircuitType.TimeBased,
        startDate: '2023-01-01',
        endDate: '2023-12-31',
      },
      futureFeature: {
        type: CircuitType.TimeBased,
        startDate: '2050-01-01',
      },
      expiredFeature: {
        type: CircuitType.TimeBased,
        startDate: '2020-01-01',
        endDate: '2021-01-01',
      },
      percentageFeature: {
        type: CircuitType.Percentage,
        percentage: 50,
      },
      groupFeature: {
        type: CircuitType.Group,
        groups: ['admin', 'beta'],
      },
      envFeature: {
        type: CircuitType.Environment,
        environments: ['production'],
      },
      deviceFeature: {
        type: CircuitType.Device,
        devices: ['mobile'],
      },
      compositeFeature: {
        type: CircuitType.Composite,
        conditions: [
          { type: CircuitType.Group, groups: ['admin'] },
          { type: CircuitType.Environment, environments: ['production'] },
        ],
      },
    };

    beforeEach(() => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2023-06-01')); // Middle of 2023

      TestBed.configureTestingModule({
        providers: [
          provideHttpClient(),
          provideHttpClientTesting(),
          CircuitService,
          provideCircuitConfig(mockConfig),
          provideCircuitContext({
            userId: 'user123',
            sessionId: 'session123',
            groups: ['admin'],
            environment: 'production',
            platform: 'mobile',
          }),
        ],
      });
      service = TestBed.inject(CircuitService);
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should handle time-based flags', () => {
      expect(service.isEnabled('timeBasedFeature')).toBe(true);
      expect(service.isEnabled('futureFeature')).toBe(false);
      expect(service.isEnabled('expiredFeature')).toBe(false);
    });

    it('should handle group-based flags', () => {
      expect(service.isEnabled('groupFeature')).toBe(true);

      // Test negative case by overriding context
      // Note: Since service is singleton and context is injected,
      // mocking context change requires re-creating module or designing service to pull context dynamically.
      // The current implementation pulls context dynamically if it's a function, or static if value.
      // Let's rely on the provided static context for 'true' and creating a new suite for 'false' if needed,
      // or just trust the logic. The logic is simple array inclusion.
      // Ideally we'd test with different contexts. Let's create a separate block for negative context.
    });

    it('should handle environment-based flags', () => {
      expect(service.isEnabled('envFeature')).toBe(true);
    });

    it('should handle device-based flags', () => {
      expect(service.isEnabled('deviceFeature')).toBe(true);
    });

    it('should handle composite flags', () => {
      expect(service.isEnabled('compositeFeature')).toBe(true);
    });

    it('should handle percentage-based flags deterministically', () => {
      // With specific session + feature, hash should be constant.
      // 'session123' + 'percentageFeature' hash % 100 check.
      const enabled = service.isEnabled('percentageFeature');
      // If we call it again, it should be the same
      expect(service.isEnabled('percentageFeature')).toBe(enabled);
    });
  });

  describe('with negative context', () => {
    const mockConfig: CircuitConfig = {
      groupFeature: { type: CircuitType.Group, groups: ['admin'] },
    };

    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          provideHttpClient(),
          provideHttpClientTesting(),
          CircuitService,
          provideCircuitConfig(mockConfig),
          provideCircuitContext({ groups: ['user'] }), // context without 'admin'
        ],
      });
      service = TestBed.inject(CircuitService);
    });

    it('should return false when group does not match', () => {
      expect(service.isEnabled('groupFeature')).toBe(false);
    });
  });

  describe('with http config', () => {
    const mockUrl = '/api/flags';
    const mockConfig: CircuitConfig = {
      featureX: true,
    };

    beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [
          provideHttpClient(),
          provideHttpClientTesting(),
          CircuitService,
          provideCircuitConfig(mockUrl),
        ],
      });
      service = TestBed.inject(CircuitService);
      httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
      httpMock.verify();
    });

    it('should load config from http', () => {
      const req = httpMock.expectOne(mockUrl);
      expect(req.request.method).toBe('GET');
      req.flush(mockConfig);

      expect(service.flags()).toEqual(mockConfig);
      expect(service.isEnabled('featureX')).toBe(true);
    });

    it('should handle http errors', () => {
      const req = httpMock.expectOne(mockUrl);
      req.flush('Error', { status: 500, statusText: 'Server Error' });

      expect(service.error()).toBe('Failed to load circuit config');
      expect(service.flags()).toEqual({});
    });
  });
});
