import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { SellComponent } from './pages/sell/sell.component';
import { BrowseComponent } from './pages/browse/browse.component';
import { ProductComponent } from './pages/product/product.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { CartComponent } from './pages/cart/cart.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { TermsComponent } from './pages/terms/terms.component';
import { PolicyComponent } from './pages/policy/policy.component';
import { FavoritesComponent } from './pages/favorites/favorites.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { ConfirmationComponent } from './pages/confirmation/confirmation.component';
import { AboutusComponent } from './pages/aboutus/aboutus.component';
import { ContactComponent } from './pages/contact/contact.component';
import { PricingComponent } from './pages/pricing/pricing.component';
import { FooterComponent } from './pages/footer/footer.component';
import { NavbarComponent } from './pages/navbar/navbar.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'sell', component: SellComponent },
  { path: 'browse', component: BrowseComponent },
  { path: 'product', component: ProductComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'cart', component: CartComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'terms', component: TermsComponent },
  { path: 'policy', component: PolicyComponent },
  { path: 'favorites', component: FavoritesComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'confirmation', component: ConfirmationComponent },
  { path: 'aboutus', component: AboutusComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'pricing', component: PricingComponent },
  { path: 'footer', component: FooterComponent },
  { path: 'navbar', component: NavbarComponent }
];

