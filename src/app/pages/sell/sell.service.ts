import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SellService {

  private apiUrl = 'https://rebook-bmsd22a.bbzwinf.ch/backend/upload-listing.php';

  constructor(private http: HttpClient) {}

  uploadListing(userData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, userData);
  }}
