import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, catchError, finalize } from 'rxjs/operators';
import { credentials } from '../credentials';
import { CommonService } from '../common/common.service';
import { ErrorHandlerService } from '../common/error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject.asObservable();

  constructor(
    private http: HttpClient,
    private commonService: CommonService,
    private errorHandler: ErrorHandlerService
  ) {}
  getAdminDashboardData(): Observable<any> {
    this.loadingSubject.next(true);
    const headers = this.commonService.getHeaders();
    return this.http.get<any>(`${credentials.host}/events/dashboard-stats`, {
      headers
    }).pipe(
      map(response => response),
      catchError(error => this.errorHandler.handleError(error)),
      finalize(() => this.loadingSubject.next(false))
    );
  } 
  getUserDashboardStats(): Observable<any> {
    this.loadingSubject.next(true);
    const headers = this.commonService.getHeaders();
    return this.http.get<any>(`${credentials.host}/events/user-dashboard`, {
      headers
    }).pipe(
      map(response => response),
      catchError(error => this.errorHandler.handleError(error)),
      finalize(() => this.loadingSubject.next(false))
    );
  }
  
  getEventById(eventId:any): Observable<any> {
    let params = {
      eventId:eventId
    };
    const headers = this.commonService.getHeaders();
    return this.http.get<any>(
      `${credentials.host}/events/get-join-event`,
      { headers,
        params
       }
    ).pipe( map(response => response),
    catchError(error => this.errorHandler.handleError(error)),
    finalize(() => this.loadingSubject.next(false)));
  }

  getUserEvents(page: number = 1, limit: number = 10): Observable<any> {
    let params = {
      page:page,
      limit:limit
    };
    const headers = this.commonService.getHeaders();
    return this.http.get<any>(
      `${credentials.host}/events/user-events`,
      { headers,
        params
       }
    ).pipe( map(response => response),
    catchError(error => this.errorHandler.handleError(error)),
    finalize(() => this.loadingSubject.next(false)));
  }
  getPendingEvents(page: number = 1, limit: number = 10): Observable<any> {
    let params = {
      page:page,
      limit:limit
    };
    const headers = this.commonService.getHeaders();
    return this.http.get<any>(
      `${credentials.host}/events/pending-events`,
      { headers,
        params
       }
    ).pipe(
      map(response => response),
      catchError(error => this.errorHandler.handleError(error)),
      finalize(() => this.loadingSubject.next(false))
    );
  }
  getAdminEvents(page: number = 1, limit: number = 10, filters: any = {}): Observable<any> {
    const headers = this.commonService.getHeaders();
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
  
    if (filters.search) params = params.set('search', filters.search);
    if (filters.status) params = params.set('status', filters.status);
    if (filters.location) params = params.set('location', filters.location);
    if (filters.startDate) params = params.set('startDate', filters.startDate.toISOString());
    if (filters.endDate) params = params.set('endDate', filters.endDate.toISOString());
  
    return this.http.get<any>(`${credentials.host}/events/admin/events`, { headers, params })
      .pipe(    
      map(response => response),
      catchError(error => this.errorHandler.handleError(error)),
      finalize(() => this.loadingSubject.next(false))
      );
  }
  getEvents(DataParams: any): Observable<any> {
    this.loadingSubject.next(true);
    const headers = this.commonService.getHeaders();
    const params = DataParams;
    return this.http.get<any>(`${credentials.host}/events`, {
      headers,
      params
    }).pipe(
      map(response => response),
      catchError(error => this.errorHandler.handleError(error)),
      finalize(() => this.loadingSubject.next(false))
    );
  }
  getAllUsers(): Observable<any> {
    this.loadingSubject.next(true);
    const headers = this.commonService.getHeaders();
    return this.http.get<any>(`${credentials.host}/events/users`, {
      headers,
    }).pipe(
      map(response => response),
      catchError(error => this.errorHandler.handleError(error)),
      finalize(() => this.loadingSubject.next(false))
    );
  }

  createEvent(eventData: any): Observable<any> {
    this.loadingSubject.next(true);
    const headers = this.commonService.getHeaders();

    return this.http.post<any>(`${credentials.host}/events/create`, 
      eventData,
      { headers }
    ).pipe(
      map(response => response.data),
      catchError(error => this.errorHandler.handleError(error)),
      finalize(() => this.loadingSubject.next(false))
    );
  }

  updateEvent(eventData: any): Observable<any> {
    this.loadingSubject.next(true);
    const headers = this.commonService.getHeaders();

    return this.http.put<any>(`${credentials.host}/events`,
      eventData,
      { headers }
    ).pipe(
      map(response => response.data),
      catchError(error => this.errorHandler.handleError(error)),
      finalize(() => this.loadingSubject.next(false))
    );
  }

  deleteEvent(eventId: number): Observable<any> {
    let params = {
      eventId:eventId 
    };
    this.loadingSubject.next(true);
    const headers = this.commonService.getHeaders();

    return this.http.delete<any>(`${credentials.host}/events`, 
      { headers,
        body: { eventId: eventId }
      }
    ).pipe(
      map(response => response.data),
      catchError(error => this.errorHandler.handleError(error)),
      finalize(() => this.loadingSubject.next(false))
    );
  }

  joinEvent(eventId: number): Observable<any> {
    this.loadingSubject.next(true);
    const headers = this.commonService.getHeaders();

    return this.http.post<any>(`${credentials.host}/events/${eventId}/join`,
      {},
      { headers }
    ).pipe(
      map(response => response.data),
      catchError(error => this.errorHandler.handleError(error)),
      finalize(() => this.loadingSubject.next(false))
    );
  }

  ApproveEvent(eventId: number, status: string): Observable<any> {
    let params = {
      eventId:eventId,
      status:status  
    };
    this.loadingSubject.next(true);
    const headers = this.commonService.getHeaders();

    return this.http.post<any>(`${credentials.host}/events/approve`,
      params,
      { headers }
    ).pipe(
      map(response => response.data),
      catchError(error => this.errorHandler.handleError(error)),
      finalize(() => this.loadingSubject.next(false))
    );
  }
  uploadEventImage(eventId: number, file: File): Observable<any> {
    this.loadingSubject.next(true);
    const headers = this.commonService.getFormDataHeaders();
    const formData = new FormData();
    formData.append('image', file);

    return this.http.post<any>(
      `${credentials.host}/events/${eventId}/image`,
      formData,
      { headers }
    ).pipe(
      map(response => response.data),
      catchError(error => this.errorHandler.handleError(error)),
      finalize(() => this.loadingSubject.next(false))
    );
  }
}