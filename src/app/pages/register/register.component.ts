import { Component } from '@angular/core';
import { RegisterService } from './register.service';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss', '../../../styles.scss'],
  imports: [FormsModule, RouterLink]
})


export class RegisterComponent {
  user = { username: '', email: '', password: '', confirmPassword: '' };
  message: string = '';

  constructor(private registerService: RegisterService, private router: Router) {}

  async register() {
    if (this.user.password !== this.user.confirmPassword) {
      this.message = 'Passwords do not match';
      return;
    }

    try {
      // Fetch response as a string
      let responseText = await lastValueFrom(this.registerService.registerUser(this.user));

      console.log("Raw Response:", responseText); // Debugging

      if (!responseText) {
        throw new Error("Empty response from server");
      }

      // Remove BOM character (if present)
      responseText = responseText.replace(/^\uFEFF/, '');

      // Parse JSON response
      const response = JSON.parse(responseText);

      if (response.status === "success") {
        this.message = response.message;
        this.router.navigate(['/home']);
      } else {
        this.message = "Registration failed!";
      }
    } catch (error) {
      this.message = "Registration failed!";
      console.error('Registration error', error);
    }
  }
}

