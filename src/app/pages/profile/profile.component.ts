import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
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
export class ProfileComponent {
  constructor(private router: Router, private http: HttpClient) {}

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
