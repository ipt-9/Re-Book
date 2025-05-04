import { Component, OnInit  } from '@angular/core';
import {RouterLink} from "@angular/router";
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import { FavoritesService } from './favorites.service';
import {DecimalPipe} from '@angular/common';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [
    RouterLink,
    NavbarComponent,
    FooterComponent,
    DecimalPipe
  ],

  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss', '../../../styles.scss']
})
export class FavoritesComponent implements OnInit {
  favorites: any[] = [];

  constructor(private favoritesService: FavoritesService) {}

  ngOnInit(): void {
    this.favorites = this.favoritesService.getAll();
  }
}
