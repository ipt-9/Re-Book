import { Component } from '@angular/core';
import {RouterLink} from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    NavbarComponent,
    FooterComponent
  ],

  templateUrl: './aboutus.component.html',
  styleUrls: ['./aboutus.component.scss', '../../../styles.scss']
})
export class AboutusComponent {

}
