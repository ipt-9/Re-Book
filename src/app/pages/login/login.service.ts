import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private apiUrl = 'https://rebook-bmsd22a.bbzwinf.ch/backend/login.php';

  constructor(private http: HttpClient) {}

  loginUser(userData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, userData);
  }
}
