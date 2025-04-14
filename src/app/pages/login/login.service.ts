import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private apiUrl = 'https://rebook-bmsd22a.bbzwinf.ch/backend/login.php';

  constructor(private http: HttpClient) {}

  loginUser(userData: any): Observable<string> {
    return this.http.post(this.apiUrl, userData, { responseType: 'text' });
  }
}

export class BookService {
  private apiUrl = 'https://rebook-bmsd22a.bbzwinf.ch/backend/get_books.php';

  constructor(private http: HttpClient) {}

  getBooks(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
}
