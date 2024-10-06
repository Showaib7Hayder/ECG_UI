import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';


export interface SignalData {
  filename: string;
  shape: number[];
  Feature_mean: number[];
  Feature_std: number[];
  diagnosis: string;
  signal: number[][];
}

@Injectable({
  providedIn: 'root',
})
export class UploadFileService {
  private fileDataSubject = new BehaviorSubject<File | null>(null);
  private signalDataSubject = new BehaviorSubject<SignalData | null>(null);

  private apiUrl = 'http://localhost:5000/ecg';

  constructor(private http: HttpClient) {}

  uploadFile(file: File): Observable<SignalData> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    return this.http.post<SignalData>(`${this.apiUrl}`, formData);
  }

  saveFileData(file: File) {
    this.fileDataSubject.next(file);
  }

  getFileData(): Observable<File | null> {
    return this.fileDataSubject.asObservable();
  }

  updateSignalData(data: SignalData) {
    this.signalDataSubject.next(data);
  }

  getSignalData(): Observable<SignalData | null> {
    return this.signalDataSubject.asObservable();
  }

  clearSignalData() {
    this.signalDataSubject.next(null);
  }

}
