import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatCheckboxModule,
    MatProgressBarModule
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  isLoading = false;
  hidePassword = true;
  hideConfirmPassword = true;
  passwordStrength = 0;
  passwordFeedback = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
  ) {
    this.registerForm = this.fb.group({});
  }

  ngOnInit(): void {
    this.initForm();
  }

  public initForm(): void {
    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/)
      ]],
      confirmPassword: ['', Validators.required],
      acceptTerms: [false, Validators.requiredTrue]
    }, {
      validator: this.passwordMatchValidator
    });
  }

  private passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('confirmPassword')?.value
      ? null : { mismatch: true };
  }

  getErrorMessage(controlName: string): string {
    const control = this.registerForm.get(controlName);
    if (control?.hasError('required')) {
      return `${controlName.charAt(0).toUpperCase() + controlName.slice(1)} is required`;
    }
    if (control?.hasError('email')) {
      return 'Please enter a valid email address';
    }
    if (control?.hasError('minlength')) {
      return 'Password must be at least 6 characters long';
    }
    if (control?.hasError('pattern')) {
      return 'Password must contain both letters and numbers';
    }
    if (controlName === 'confirmPassword' && this.registerForm.hasError('mismatch')) {
      return 'Passwords do not match';
    }
    return '';
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.isLoading = true;
      const formData = this.registerForm.value;
      
      this.authService.register(formData).subscribe({
        next: () => {
          this.snackBar.open(
            'Registration successful! Please check your email to verify your account.',
            'Close',
            {
              duration: 5000,
              verticalPosition: 'top',
              panelClass: ['success-snackbar']
            }
          );
          this.router.navigate(['/login']);
        },
        error: (error) => {
          this.isLoading = false;
          console.log(error)
          this.snackBar.open(
            error.error?.error.message || 'Registration failed. Please try again.',
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
    } else {
      this.markFormGroupTouched(this.registerForm);
    }
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}
export interface RegistrationData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phoneNumber: string;
  acceptTerms: boolean;
}