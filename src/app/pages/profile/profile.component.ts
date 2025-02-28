import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth.service';
import {Router, RouterLink} from '@angular/router';
import {NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  imports: [
    RouterLink,
    NgIf,
    NgForOf
  ],
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  user: any = null;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.authService.getUserData().subscribe(
      (response) => {
        if (response.status === 'success') {
          this.user = response.user;
        } else {
          this.router.navigate(['/login']); // Redirect if not logged in
        }
      },
      (error) => {
        console.error('Error fetching user data', error);
        this.router.navigate(['/login']); // Redirect if error occurs
      }
    );
  }

  logout() {
    this.authService.logout().subscribe(response => {
      if (response.status === 'success') {
        this.user = null;
        this.router.navigate(['/login']); // Redirect after logout
      }
    });
  }
}
