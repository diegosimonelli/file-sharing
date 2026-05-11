import { Component, OnDestroy, OnInit } from '@angular/core';
import { FileUploadService } from '../services/file-upload.service';

interface UploadedFile {
  name: string;
  size: number;
  type: string;
  uploadedAt: Date;
  expiresAt: Date;
  remainingMs: number;
  expired: boolean;
  link: string;
}

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent implements OnInit, OnDestroy {

  readonly fileAvailabilityMinutes = 60;
  private readonly fileAvailabilityMs = this.fileAvailabilityMinutes * 60 * 1000;
  private countdownTimer: any;

  shortLink: string = '';
  loading: boolean = false;
  errorMessage: string = '';
  isDragging: boolean = false;
  file: File = null;
  uploadedFiles: UploadedFile[] = [];

  constructor(private fileUploadService : FileUploadService) { }

  ngOnInit(): void {
    this.countdownTimer = setInterval(() => this.updateCountdowns(), 1000);
  }

  ngOnDestroy(): void {
    if (this.countdownTimer) {
      clearInterval(this.countdownTimer);
    }
  }

  // when selecting or dropping the file
  onChange(event) {
    this.setFile(event.target.files && event.target.files[0]);
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.isDragging = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragging = false;
    this.setFile(event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files[0]);
  }

  // when clicking the button upload
  onUpload() {
    if (!this.file || this.loading) {
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.fileUploadService.upload(this.file).subscribe((event: any) => {
      if (typeof (event) === 'object') {
        if (event.success === false || !event.link) {
          this.errorMessage = event.message || 'Upload failed. Please try again in a moment.';
          this.loading = false;
          return;
        }

        this.shortLink = event.link;
        const uploadedAt = new Date();
        const expiresAt = new Date(uploadedAt.getTime() + this.fileAvailabilityMs);

        this.uploadedFiles.unshift({
          name: this.file.name,
          size: this.file.size,
          type: this.file.type || 'Unknown',
          uploadedAt,
          expiresAt,
          remainingMs: this.fileAvailabilityMs,
          expired: false,
          link: this.shortLink
        });
        this.updateCountdowns();
        this.loading = false;
      }
    }, () => {
      this.errorMessage = 'Upload failed. Please check your connection and try again.';
      this.loading = false;
    });
  }

  /* To copy Text from Textbox */
  copyInputMessage(inputElement){
    inputElement.select();
    document.execCommand('copy');
    inputElement.setSelectionRange(0, 0);
  }

  copyLink(link: string) {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(link);
    }
  }

  deleteUploadedFile(fileToDelete: UploadedFile) {
    this.uploadedFiles = this.uploadedFiles.filter((uploadedFile) => uploadedFile !== fileToDelete);
  }

  shareFile(uploadedFile: UploadedFile) {
    const navigatorWithShare = navigator as Navigator & { share?: (data: ShareData) => Promise<void> };

    if (navigatorWithShare.share) {
      navigatorWithShare.share({
        title: uploadedFile.name,
        text: 'Here is a file shared with FileShare.',
        url: uploadedFile.link
      });
      return;
    }

    this.copyLink(uploadedFile.link);
  }

  formatFileSize(size: number): string {
    if (!size) {
      return '0 KB';
    }

    const units = ['B', 'KB', 'MB', 'GB'];
    const unitIndex = Math.min(Math.floor(Math.log(size) / Math.log(1024)), units.length - 1);
    const readableSize = size / Math.pow(1024, unitIndex);

    return `${readableSize.toFixed(unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
  }

  formatRemainingTime(remainingMs: number): string {
    if (remainingMs <= 0) {
      return 'Expired';
    }

    const totalSeconds = Math.floor(remainingMs / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${minutes}m ${seconds.toString().padStart(2, '0')}s`;
  }

  getExpiryProgress(uploadedFile: UploadedFile): number {
    const elapsedMs = this.fileAvailabilityMs - uploadedFile.remainingMs;

    return Math.min(100, Math.max(0, (elapsedMs / this.fileAvailabilityMs) * 100));
  }

  private setFile(file: File) {
    if (!file) {
      return;
    }

    this.file = file;
    this.errorMessage = '';
    this.shortLink = '';
  }

  private updateCountdowns() {
    const now = Date.now();

    this.uploadedFiles = this.uploadedFiles.map((uploadedFile) => {
      const remainingMs = Math.max(0, uploadedFile.expiresAt.getTime() - now);

      return {
        ...uploadedFile,
        remainingMs,
        expired: remainingMs === 0
      };
    });
  }

}
