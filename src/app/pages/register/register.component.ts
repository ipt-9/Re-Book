import { Component } from '@angular/core';
import { RegisterService } from './register.service';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss', '../../../styles.scss'],
  imports: [
    FormsModule,
    RouterLink,
    NavbarComponent,
    FooterComponent
  ]
})
export class RegisterComponent {
  user = {
    email: '',
    username: '',
    password: '',
    region: ''
  };

  constructor(private registerService: RegisterService, private router: Router) {}

  async register() {
    try {
      const response = await lastValueFrom(this.registerService.registerUser(this.user));
      alert('Registration successful! Redirecting to login page.');
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Registration failed', error);
      alert('Registration failed. Please try again.');
    }
  }
}
