import { Component, OnInit  } from '@angular/core';
import {RouterLink} from "@angular/router";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import {NgForOf, DecimalPipe, NgIf, JsonPipe} from '@angular/common';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [
    NavbarComponent,
    FooterComponent,
    DecimalPipe,
    NgForOf,
    NgIf,
    RouterLink,
    JsonPipe
  ],
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss', '../../../styles.scss']
})
export class FavoritesComponent implements OnInit {
  favourites: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (!token) return;

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get('https://rebook-bmsd22a.bbzwinf.ch/backend/favorite.php', { headers })
      .subscribe({
        next: (res: any) => {
          console.log('Favorites loaded:', res); // ✅ Confirm this shows up
          this.favourites = res.favorites || [];
        },
        error: (err) => {
          console.error('Failed to load favorites:', err);
        }
      });
  }

}

