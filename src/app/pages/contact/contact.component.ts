import { Component } from '@angular/core';
import {RouterLink} from "@angular/router";
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [
    NavbarComponent,
    FooterComponent
  ],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss', '../../../styles.scss']
})
export class ContactComponent {

}
