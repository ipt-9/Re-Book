import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RouterLink,
    NavbarComponent,
    FooterComponent
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss', '../../../styles.scss']
})
export class HomeComponent { }
