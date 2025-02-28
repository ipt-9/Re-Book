import { Component } from '@angular/core';
import { LoginService } from './login.service';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss', '../../../styles.scss'],
  imports: [FormsModule, RouterLink]
})
export class LoginComponent {
  user = { email: '', password: '' };
  message: string = '';

  constructor(private loginService: LoginService, private router: Router) {}
  async login() {
    try {
      // API-Aufruf und direkt JSON-Objekt erhalten
      let response = await lastValueFrom(this.loginService.loginUser(this.user));

      console.log("Response Object:", response); // Debugging

      if (!response) {
        throw new Error("Empty response from server");
      }

      if (response.status === "success") {
        this.message = "Login successful!";
        localStorage.setItem('token', response.token); // Store token
        this.router.navigate(['/home']);
      } else {
        this.message = response.message || "Login failed!";
        console.warn("Login failed with credentials:", this.user); // Debugging: Log the used credentials
      }
    } catch (error) {
      this.message = "Login failed!";
      console.error('Login error', error);
      console.warn("Login attempt with:", this.user); // Debugging: Log credentials on error
    }
  }

}
