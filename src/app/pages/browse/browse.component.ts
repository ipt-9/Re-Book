import { Component } from '@angular/core';
import {RouterLink} from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-browse',
  standalone: true,
  imports: [
    RouterLink,
    NavbarComponent,
    FooterComponent
  ],
  templateUrl: './browse.component.html',
  styleUrls: ['./browse.component.scss', '../../../styles.scss']
})
export class BrowseComponent {

}
