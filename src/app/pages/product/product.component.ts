import { Component } from '@angular/core';
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-product',
    imports: [
        RouterLink
    ],
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss', '../../../styles.scss']
})
export class ProductComponent {

}
