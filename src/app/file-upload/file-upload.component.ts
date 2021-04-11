import { Component, OnInit } from '@angular/core';
import { FileUploadService } from '../services/file-upload.service';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent implements OnInit {

  shortLink: string = "";
  loading: boolean = false;
  file: File = null;

  constructor(private fileUploadService : FileUploadService) { }

  ngOnInit(): void {
  }

  // when selecting the file
  onChange(event) {
    this.file = event.target.files[0];
  }

  // when clicking the button upload
  onUpload() {
    this.loading = !this.loading;
    console.log(this.file);
    this.fileUploadService.upload(this.file).subscribe((event: any) => {
      if (typeof (event) === 'object') {
        this.shortLink = event.link;
        this.loading = false;
      }
    })
  }


}
