import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, catchError, finalize, tap } from 'rxjs/operators';
import { credentials } from '../credentials';
import { CommonService } from '../common/common.service';
import { ErrorHandlerService } from '../common/error-handler.service';
import { Router } from '@angular/router';

interface AuthResponse {
  token: string;
  user: any;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasValidToken());
  private userSubject = new BehaviorSubject<any>(this.getUserFromStorage());
  private loadingSubject = new BehaviorSubject<boolean>(false);

  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  user$ = this.userSubject.asObservable();
  loading$ = this.loadingSubject.asObservable();

  constructor(
    private router: Router,
    private http: HttpClient,
    private commonService: CommonService,
    private errorHandler: ErrorHandlerService
  ) {}

  login(email: string, password: string): Observable<AuthResponse> {
    this.loadingSubject.next(true);
    const headers = this.commonService.getHeaders();

    return this.http.post<AuthResponse>(`${credentials.host}/users/login`, 
      { email, password },
      { headers }
    ).pipe(
      map(response => this.handleAuthResponse(response)),
      catchError(error => this.errorHandler.handleError(error)),
      finalize(() => this.loadingSubject.next(false))
    );
  }

  register(userData: any): Observable<any> {
    this.loadingSubject.next(true);
    const headers = this.commonService.getHeaders();

    return this.http.post<any>(`${credentials.host}/users/register`, 
      userData,
      { headers }
    ).pipe(
      map(response => response.data),
      catchError(error => this.errorHandler.handleError(error)),
      finalize(() => this.loadingSubject.next(false))
    );
  }

  forgotPassword(email: string): Observable<any> {
    this.loadingSubject.next(true);
    const headers = this.commonService.getHeaders();

    return this.http.post<any>(`${credentials.host}/users/forgot-password`,
      { email },
      { headers }
    ).pipe(
      map(response => response.data),
      catchError(error => this.errorHandler.handleError(error)),
      finalize(() => this.loadingSubject.next(false))
    );
  }

  resetPassword(token: string, password: string): Observable<any> {
    this.loadingSubject.next(true);
    const headers = this.commonService.getHeaders();

    return this.http.post<any>(`${credentials.host}/users/reset-password`,
      { token, password },
      { headers }
    ).pipe(
      map(response => response.data),
      catchError(error => this.errorHandler.handleError(error)),
      finalize(() => this.loadingSubject.next(false))
    );
  }

  verifyEmail(token: string): Observable<any> {
    this.loadingSubject.next(true);
    const headers = this.commonService.getHeaders();

    return this.http.post<any>(`${credentials.host}/users/verify-email`,
      { token },
      { headers }
    ).pipe(
      map(response => response.data),
      catchError(error => this.errorHandler.handleError(error)),
      finalize(() => this.loadingSubject.next(false))
    );
  }

  private handleAuthResponse(response: AuthResponse): AuthResponse {
    localStorage.setItem('token', response.token);
    localStorage.setItem('user', JSON.stringify(response.user));
    this.isAuthenticatedSubject.next(true);
    this.userSubject.next(response.user);
    return response;
  }

  isAuthenticated(): boolean {
    return this.hasValidToken();
  }


  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/login']);
  }
  private hasValidToken(): boolean {
    const token = localStorage.getItem('token');
    return !!token;
  }

  public getUserFromStorage(): any {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }
}