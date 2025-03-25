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
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    school: '',
    region: ''
  };
  message: string = '';

  constructor(private registerService: RegisterService, private router: Router) {}

  async register() {
    if (this.user.password !== this.user.confirmPassword) {
      this.message = 'Passwords do not match';
      return;
    }

    try {
      let responseText = await lastValueFrom(this.registerService.registerUser(this.user));

      console.log("Raw Response:", responseText);
      if (!responseText) throw new Error("Empty response from server");

      responseText = responseText.replace(/^\uFEFF/, '');

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
