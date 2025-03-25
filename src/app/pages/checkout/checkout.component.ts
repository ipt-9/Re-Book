import { Component } from '@angular/core';
import {Router, RouterLink} from '@angular/router';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  imports: [
    RouterLink
  ],
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent {
  constructor(private router: Router) {}

  goToConfirmation(): void {
    this.router.navigate(['/confirmation']);
  }
}
