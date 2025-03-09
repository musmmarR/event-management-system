import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AuthGuard } from './guards/auth.guard';
import { HomeGuard } from './guards/home.guard';

export const routes: Routes = [
    {
        path: '',
        canActivate: [HomeGuard],
        loadComponent: () => import('./pages/home/home.component')
          .then(m => m.HomeComponent)
      },
      {
        path: 'events',
        loadComponent: () => import('./pages/events/events.component')
          .then(m => m.EventsComponent)
      },
    { 
        path: 'login', 
        component: LoginComponent 
      },
      { 
        path: 'register', 
        component: RegisterComponent 
      },
      {
        path: 'events/join/:id',
        loadComponent: () => import('./pages/join-event/join-event.component')
          .then(m => m.JoinEventComponent)
      },
      {
        path: 'dashboard',
        canActivate: [AuthGuard],
        loadComponent: () => import('./pages/dashboard/dashboard.component')
          .then(m => m.DashboardComponent)
      },
      {
        path: 'pending-events',
        canActivate: [AuthGuard],
        loadComponent: () => import('./pages/pending-events/pending-events.component')
          .then(m => m.PendingEventsComponent)
      },
      {
        path: 'admin/events',
        canActivate: [AuthGuard],
        loadComponent: () => import('./pages/all-events/all-events.component')
          .then(m => m.AllEventsComponent),
       
      },
      {
        path: 'my-events',
        canActivate: [AuthGuard],
        loadComponent: () => import('./pages/main-events/main-events.component')
          .then(m => m.MainEventsComponent)
      },
      {
        path: '**',
        redirectTo: ''
      }
];
