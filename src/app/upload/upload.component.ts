import { Component, EventEmitter, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './upload.component.html',
  styleUrl: './upload.component.css',
})
export class UploadComponent {
  @Output() upload = new EventEmitter<File>();

  selectedFile = signal<File | null>(null);
  previewUrl = signal<string | null>(null);
  errorMessage = signal<string | null>(null);

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.item(0) ?? null;

    if (!file) {
      this.clearSelection();
      return;
    }

    this.errorMessage.set(null);
    this.selectedFile.set(file);
    this.setPreview(file);
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    const file = event.dataTransfer?.files?.item(0) ?? null;
    if (!file) {
      return;
    }
    this.errorMessage.set(null);
    this.selectedFile.set(file);
    this.setPreview(file);
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  onUpload(): void {
    const file = this.selectedFile();
    if (!file) {
      this.errorMessage.set('請先選擇要上傳的檔案。');
      return;
    }

    this.upload.emit(file);
  }

  clearSelection(): void {
    this.selectedFile.set(null);
    this.previewUrl.set(null);
    this.errorMessage.set(null);
  }

  private setPreview(file: File): void {
    const fileType = file.type;
    if (fileType.startsWith('image/')) {
      this.previewUrl.set(URL.createObjectURL(file));
      return;
    }
    this.previewUrl.set(null);
  }
}
