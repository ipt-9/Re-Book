import { Component } from '@angular/core';
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-favorites',
    imports: [
        RouterLink
    ],
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss', '../../../styles.scss']
})
export class FavoritesComponent {

}
