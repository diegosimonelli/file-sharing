import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { FileUploadService } from './file-upload.service';
import { environment } from '../../environments/environment';

describe('FileUploadService', () => {
  let service: FileUploadService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(FileUploadService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('uploads a file through the configured proxy endpoint', () => {
    const file = new File(['hello'], 'hello.txt', { type: 'text/plain' });

    service.upload(file).subscribe();

    const request = httpMock.expectOne(environment.fileUploadApiUrl);
    expect(request.request.method).toBe('POST');
    expect(request.request.body instanceof FormData).toBeTrue();
    request.flush({ status: 'success', data: { url: 'http://tmpfiles.org/123/hello.txt' } });
  });
});
