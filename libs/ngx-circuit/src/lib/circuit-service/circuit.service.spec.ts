import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { CircuitService } from './circuit.service';
import { provideCircuitConfig, CircuitConfig } from '../circuit.config';

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
