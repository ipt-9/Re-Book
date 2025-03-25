import { Component } from '@angular/core';
import { AuthService } from './login.service';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
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
  email = '';
  password = '';

  constructor(private authService: AuthService) {}

  login() {
    this.authService.login(this.email, this.password).subscribe(
      response => alert(response.message),
      error => alert('Login failed')
    );
  }
}
