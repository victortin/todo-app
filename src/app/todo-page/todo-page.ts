import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploadComponent } from '../upload/upload.component';

@Component({
  selector: 'app-todo-page',
  imports: [CommonModule, UploadComponent],
  templateUrl: './todo-page.html',
  styleUrl: './todo-page.css',
})
export class TodoPage {
  uploadedMessage = signal('');
  errorMessage = signal<string | null>(null);
  uploading = signal(false);

  async handleUpload(file: File): Promise<void> {
    this.uploadedMessage.set('');
    this.errorMessage.set(null);
    this.uploading.set(true);

    const uploadUrl = '/api/upload';
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(uploadUrl, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `上傳失敗：HTTP ${response.status}`);
      }

      const result = await response.json().catch(() => null);
      const successText = result?.message ?? '檔案已成功上傳至後端。';
      this.uploadedMessage.set(`${successText} (${file.name}, ${(file.size / 1024).toFixed(1)} KB)`);
    } catch (error) {
      this.errorMessage.set(
        error instanceof Error
          ? `上傳失敗：${error.message}`
          : '上傳時發生未知錯誤，請稍後重試。'
      );
    } finally {
      this.uploading.set(false);
    }
  }
}

