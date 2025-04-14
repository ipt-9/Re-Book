import { Component } from '@angular/core';
import { LoginService } from './login.service';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss', '../../../styles.scss'],
  imports: [
    FormsModule,
    RouterLink,
    NavbarComponent,
    FooterComponent
  ]
})
export class LoginComponent {
  user = {
    email: '',
    password: ''
  };

  constructor(private loginSSService: LoginService, private router: Router) {}

  async login() {
    try {
      const response = await lastValueFrom(this.loginSSService.loginUser(this.user));
      alert('Login successful! Redirecting to profile.');
      this.router.navigate(['/profile']);
    } catch (error) {
      console.error('Login failed', error);
      alert('Invalid email or password. Please try again.');
    }
  }
}

