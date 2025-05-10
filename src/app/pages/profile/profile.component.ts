import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import {DecimalPipe, NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    RouterLink,
    NavbarComponent,
    FooterComponent,
    FormsModule,
    DecimalPipe,
    NgIf,
    NgForOf,
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  user: any = null;
  advertisedProducts: any[] = [];
  soldProducts: any[] = [];
  boughtProducts: any[] = [];

  constructor(
    private router: Router,
    private http: HttpClient,
    private authService: AuthService,
  private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const token = this.authService.getToken();
    console.log('🔐 Token in ProfileComponent:', token);
    if (!token) {
      this.router.navigate(['/login']);
      return;
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get('https://rebook-bmsd22a.bbzwinf.ch/backend/user.php', { headers })
      .subscribe({
        next: (response: any) => {
          if (response.success) {
            this.user = response.user;

            console.log('✅ USER geladen:', this.user);

            this.cdr.detectChanges(); // 🛠️ hier Trigger für die Anzeige
          } else {
            this.router.navigate(['/login']);
          }
        },
        error: (err) => {
          console.error('Error fetching user data:', err);
          this.router.navigate(['/login']);
        }
      });

    this.http.get('https://rebook-bmsd22a.bbzwinf.ch/backend/get_user_products.php', { headers })
      .subscribe({
        next: (response: any) => {
          if (response.success && response.data) {
            this.advertisedProducts = response.data.advertised || [];
            this.soldProducts = response.data.sold || [];
            //this.boughtProducts = response.data.bought || [];
          }
        },
        error: (err) => {
          console.error('Error fetching user products:', err);
        }
      });
  }

  logout() {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.post('https://rebook-bmsd22a.bbzwinf.ch/backend/logout.php', {}, { headers }).subscribe({
      next: () => {
        this.authService.removeToken();
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Logout failed:', err);
        alert('Logout failed.');
      }
    });
  }

  saveProfile() {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    // 🛠️ Ensure optional fields are not null (again, just in case)
    this.user.nickname = this.user.nickname ?? '';
    this.user.gender = this.user.gender ?? '';
    this.user.language = this.user.language ?? '';
    this.user.school = this.user.school ?? '';
    this.user.region = this.user.region ?? '';

    this.http.post('https://rebook-bmsd22a.bbzwinf.ch/backend/update_user.php', this.user, { headers })
      .subscribe({
        next: () => alert('Profil gespeichert!'),
        error: () => alert('Fehler beim Speichern')
      });
  }

  removeItem(index: number) {
    const item = this.advertisedProducts[index];

    this.http.post(
      'https://rebook-bmsd22a.bbzwinf.ch/backend/delete_item.php',
      { listing_id: item.listing_id },
      {
        headers: new HttpHeaders({
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
          'Content-Type': 'application/json'
        }),
        responseType: 'text'  // <--- TEMP: allows you to inspect raw response
      }
    ).subscribe({
      next: res => {
        console.log('Raw response:', res);  // See what's being returned
        this.advertisedProducts.splice(index, 1);
      },
      error: err => {
        console.error('Error deleting item:', err);
      }
    });

  }


}
