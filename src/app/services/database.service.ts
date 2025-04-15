import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private apiUrl = 'https://rebook-bmsd22a.bbzwinf.ch/api/connection';

  constructor(private http: HttpClient) {}

}

