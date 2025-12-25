import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventsService {
  private apiUrl = '/api/events';
  private tasksUrl = '/api/tasks';
  private invitationsUrl = '/api/invitations';

  constructor(private http: HttpClient) {}

  private authHeader() {
    const token = localStorage.getItem('token');
    return { headers: new HttpHeaders({ 'Authorization': `Bearer ${token}` }) };
  }

  getEvents(): Observable<any> { return this.http.get(this.apiUrl, this.authHeader()); }
  getMyEvents(): Observable<any> { return this.getEvents(); }
  getEvent(id: number): Observable<any> { return this.http.get(`${this.apiUrl}/${id}`, this.authHeader()); }
  createEvent(data: any): Observable<any> { return this.http.post(this.apiUrl, data, this.authHeader()); }
  updateEvent(id: number, data: any): Observable<any> { return this.http.put(`${this.apiUrl}/${id}`, data, this.authHeader()); }
  deleteEvent(id: number): Observable<any> { return this.http.delete(`${this.apiUrl}/${id}`, this.authHeader()); }

  getEventAttendees(eventId: number): Observable<any> { return this.http.get(`${this.apiUrl}/${eventId}/attendees`, this.authHeader()); }
  inviteAttendee(eventId: number, data: { email: string; role?: string }): Observable<any> { return this.http.post(`${this.apiUrl}/${eventId}/invite`, data, this.authHeader()); }
  respondToInvitation(eventId: number, status: string): Observable<any> { return this.http.put(`${this.apiUrl}/${eventId}/rsvp`, { status }, this.authHeader()); }
  getMyInvitations(): Observable<any> { return this.http.get(`${this.invitationsUrl}/my`, this.authHeader()); }

  getTasks(eventId: number): Observable<any> { return this.http.get(`${this.tasksUrl}/${eventId}/tasks`, this.authHeader()); }
  addTask(eventId: number, data: any): Observable<any> { return this.http.post(`${this.tasksUrl}/${eventId}/tasks`, data, this.authHeader()); }
  updateTask(eventId: number, taskId: number, data: any): Observable<any> { return this.http.put(`${this.tasksUrl}/${taskId}`, data, this.authHeader()); }
  deleteTask(eventId: number, taskId: number): Observable<any> { return this.http.delete(`${this.tasksUrl}/${taskId}`, this.authHeader()); }

  searchEvents(params: any): Observable<any> {
    const queryParams = new URLSearchParams(params).toString();
    return this.http.get(`/api/search?${queryParams}`, this.authHeader());
  }
}
