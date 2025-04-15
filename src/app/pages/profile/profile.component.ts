import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    RouterLink,
    NavbarComponent,
    FooterComponent
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  user: any = null;

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/login']);
      return;
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    this.http.get('https://rebook-bmsd22a.bbzwinf.ch/backend/get_user.php', { headers })
      .subscribe({
        next: (response: any) => {
          if (response.success) {
            this.user = response.user;
          } else {
            this.router.navigate(['/login']);
          }
        },
        error: (err) => {
          console.error('Error fetching user data:', err);
          this.router.navigate(['/login']);
        }
      });
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
