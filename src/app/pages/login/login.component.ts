import { Component } from '@angular/core';
import { LoginService } from './login.service';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import { AuthService } from '../../services/auth.service';

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

  constructor(  private loginSSService: LoginService,
                private router: Router,
                private authService: AuthService) {}

  async login() {
    try {
      const response = await lastValueFrom(this.loginSSService.loginUser(this.user));

      if (response.success && response.token) {
        this.authService.setToken(response.token);
        alert('Login successful! Redirecting to profile.');
        this.router.navigate(['/profile']);
      } else {
        alert('Login failed: ' + response.message);
      }

    } catch (error) {
      console.error('Login failed', error);
      alert('Invalid email or password. Please try again.');
    }
  }

}

