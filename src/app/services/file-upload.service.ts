import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  baseApiUrl = "https://file.io";

  constructor(private http : HttpClient) { }

  upload(file): Observable<any> {
    //create form data
    const formData = new FormData();

    //Store form name as file with file data
    formData.append("file", file, file.name);

    //make http post request over api
    return this.http.post(this.baseApiUrl, formData);
  }

}
