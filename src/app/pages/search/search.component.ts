import { Component } from '@angular/core';
import {RouterLink} from "@angular/router";
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

  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss', '../../../styles.scss']
})
export class SearchComponent {

}
