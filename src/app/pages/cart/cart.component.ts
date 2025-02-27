import { Component } from '@angular/core';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-cart',
  imports: [
    RouterLink
  ],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss', '../../../styles.scss']
})
export class CartComponent {

}
