import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NgClass, NgIf } from '@angular/common';
import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-header',
  imports: [
    RouterLink,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    NgClass,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  isLoggedIn = false; 
  isAdmin = false; 
  isMobileMenuOpen = false;
  constructor(private router: Router,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.authService.isAuthenticated$.subscribe((isAuthenticated) => { 
      this.isLoggedIn = isAuthenticated;
    });
    this.authService.user$.subscribe((user) => {
      this.isAdmin = user?.isAdmin;
    });
  }
  get LoggedIn(): boolean {
    return this.authService.isAuthenticated();
  }

  onLogoClick() {
    if (this.LoggedIn) {
      this.router.navigate(['/dashboard']);
    } else {
      this.router.navigate(['/']);
    }
  }
  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  logout() {
    this.authService.logout();
  }

}
