import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

// Uploads go to /api/file. Netlify (src/_redirects) and the dev server
// (proxy.conf.json) forward that path to the tmpfiles.org upload API,
// which keeps files for 60 minutes.
const UPLOAD_URL = '/api/file';

interface TmpFilesUploadResponse {
  status: string;
  message?: string;
  data?: {
    url?: string;
  };
}

export interface UploadResult {
  success: boolean;
  link: string;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  constructor(private http: HttpClient) { }

  upload(file: File): Observable<UploadResult> {
    const formData = new FormData();
    formData.append('file', file, this.safeFileName(file.name));

    return this.http.post<TmpFilesUploadResponse>(UPLOAD_URL, formData).pipe(
      map((response) => {
        const link = this.toHttps(response?.data?.url);
        return {
          success: response?.status === 'success' && !!link,
          link,
          message: link ? undefined : 'The upload service did not return a share link.'
        };
      }),
      catchError((error: HttpErrorResponse) => of({
        success: false,
        link: '',
        message: error.error?.message
          ? `Upload failed: ${error.error.message}`
          : 'Upload failed. Please check your connection and try again.'
      }))
    );
  }

  // tmpfiles.org rejects names whose base is a single character (e.g. "a.txt").
  private safeFileName(name: string): string {
    const dot = name.lastIndexOf('.');
    const base = dot > 0 ? name.slice(0, dot) : name;
    return base.length < 2 ? `file-${name}` : name;
  }

  private toHttps(url?: string): string {
    return url ? url.replace(/^http:\/\//, 'https://') : '';
  }

}
