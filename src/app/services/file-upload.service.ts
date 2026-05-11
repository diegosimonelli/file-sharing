import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

interface TmpFilesUploadResponse {
  status: string;
  data?: {
    url?: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  baseApiUrl = environment.fileUploadApiUrl;

  constructor(private http : HttpClient) { }

  upload(file): Observable<any> {
    const formData = new FormData();

    formData.append('file', file, file.name);

    return this.http.post<TmpFilesUploadResponse>(this.baseApiUrl, formData).pipe(
      map((response) => {
        const url = response && response.data && response.data.url;
        const link = this.toDirectDownloadUrl(url);

        return {
          success: response && response.status === 'success' && !!link,
          link,
          message: link ? undefined : 'The upload service did not return a share link.'
        };
      })
    );
  }

  private toDirectDownloadUrl(url: string): string {
    if (!url) {
      return '';
    }

    if (url.startsWith('http://tmpfiles.org/')) {
      return url.replace('http://tmpfiles.org/', 'https://tmpfiles.org/dl/');
    }

    if (url.startsWith('https://tmpfiles.org/')) {
      return url.replace('https://tmpfiles.org/', 'https://tmpfiles.org/dl/');
    }

    return url;
  }

}
