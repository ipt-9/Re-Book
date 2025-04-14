import { Component } from '@angular/core';
import {RouterLink} from "@angular/router";
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-confirmation',
  standalone: true,
  imports: [
    RouterLink,
    NavbarComponent,
    FooterComponent
  ],
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss', '../../../styles.scss']
})
export class ConfirmationComponent {

}
