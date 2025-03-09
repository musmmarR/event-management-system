import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService } from '../../services/auth.service';
import { EventService } from '../../services/event.service';
@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatToolbarModule,
    MatButtonModule,
    MatCardModule,
    MatMenuModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  isAdmin = false;
  menuItems: any[] = [];
  stats: any = {
    totalEvents: 0,
    upcomingEvents: 0,
    totalUsers: 0,
    pendingEvents: 0,
    pastEvents: 0
  };
  events: any[] = [];

  constructor(
    private authService: AuthService,
    private eventService: EventService,
    private router: Router
  ) {
    this.authService.user$.subscribe((user) => {
      this.isAdmin = user?.isAdmin;
    });
    this.setMenuItems();
  }

  ngOnInit() {
    this.loadDashboardData();
  }
  private setMenuItems() {
    if (this.isAdmin) {
      this.menuItems = [
        { label: 'Dashboard', icon: 'dashboard', route: '/dashboard' },
        { label: 'Events', icon: 'event', route: '/admin/events' },
        { label: 'Pending Events', icon: 'event', route: '/pending-events' },
        // { label: 'Users', icon: 'people', route: '/users' },
        // { label: 'Settings', icon: 'settings', route: '/settings' }
      ];
    } else {
      this.menuItems = [
        { label: 'Dashboard', icon: 'dashboard', route: '/dashboard' },
        { label: 'My Events', icon: 'event', route: '/my-events' },
        // { label: 'Profile', icon: 'person', route: '/profile' }
      ];
    }
  }

  private loadDashboardData() {
    if (this.isAdmin) {
      // Load admin dashboard data
      this.loadAdminData();
    } else {
      // Load user dashboard data
      this.loadUserData();
    }
  }
  private loadAdminData() {
    // Implement admin data loading
    this.eventService.getAdminDashboardData().subscribe(data => {
      console.log(data)
      console.log(data.stats)
      this.stats = data.stats;
      this.events = data.recentEvents;
    });
  }

  private loadUserData() {
    // Implement admin data loading
    this.eventService.getUserDashboardStats().subscribe(data => {
      console.log(data)
      console.log(data.stats)
        this.stats = data.stats;
      this.events = data.upcomingEvents;
    });
  }

  logout() {
    this.authService.logout();
  }
}
