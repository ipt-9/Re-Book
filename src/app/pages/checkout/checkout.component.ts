import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-checkout',
  standalone: true,
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
  imports: [
    RouterLink,
    NavbarComponent,
    FooterComponent
  ]
})
export class CheckoutComponent {
  constructor(private router: Router) {}

  goToConfirmation(): void {
    this.router.navigate(['/confirmation']);
  }
}
