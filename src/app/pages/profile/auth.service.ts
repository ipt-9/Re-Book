import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost/Re-Book/backend';

  constructor(private http: HttpClient) {}

  // Fetch logged-in user data
  getUserData(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/user.php`, { withCredentials: true });
  }

  // Logout user
  logout(): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/logout.php`, {}, { withCredentials: true });
  }
}
