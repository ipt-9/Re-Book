import { Component, OnInit  } from '@angular/core';
import {RouterLink} from "@angular/router";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import {DecimalPipe} from '@angular/common';



@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [
    NavbarComponent,
    FooterComponent,
    DecimalPipe,
    RouterLink
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
          this.favourites = res.favorites || [];
        },
        error: (err) => {
          console.error('Failed to load favorites:', err);
        }
      });
  }
}

