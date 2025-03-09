import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink,Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../services/auth.service';
@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    RouterLink, 
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  hidePassword = true;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      const { email, password } = this.loginForm.value;

      this.authService.login(email, password).subscribe({
        next: () => {
          this.snackBar.open('Login successful!', 'Close', {
            duration: 3000,
            verticalPosition: 'top'
          });
          this.router.navigate(['/dashboad']);
        },
        error: (error) => {
          this.isLoading = false;
          console.log(error.error)
          this.snackBar.open(
            error.error?.error.message || 'Login failed. Please try again.',
            'Close',
            {
              duration: 5000,
              verticalPosition: 'top',
              panelClass: ['error-snackbar']
            }
          );
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    }
  }
}
