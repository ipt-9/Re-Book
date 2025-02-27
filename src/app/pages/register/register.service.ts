import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RegisterService {
  private apiUrl = 'http://localhost/Re-Book/backend/register.php';

  constructor(private http: HttpClient) {}

  registerUser(userData: any): Observable<string> {
    return this.http.post(this.apiUrl, userData, { responseType: 'text' });
  }
}
