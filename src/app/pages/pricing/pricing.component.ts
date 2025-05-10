import { Component } from '@angular/core';
import {Router, RouterLink} from "@angular/router";
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

  templateUrl: './pricing.component.html',
  styleUrl: './pricing.component.scss'
})
export class PricingComponent {
  constructor(private router: Router) {}

  buyPremium(): void {
    this.router.navigate(['/checkout']);
  }
  buyBooster(): void {
    this.router.navigate(['/checkout']);
  }
}
