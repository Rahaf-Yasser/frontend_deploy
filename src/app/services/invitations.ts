import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InvitationsService {
  private api = '/api/invitations';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  // GET my invitations (status = 'invited')
  getPending(): Observable<any[]> {
    return this.http.get<any[]>(`${this.api}/my`, { headers: this.getHeaders() });
  }

  // Update my response (going / maybe / not going)
  updateStatus(eventId: number, status: string): Observable<any> {
    return this.http.put(`${this.api}/${eventId}/rsvp`, { status }, { headers: this.getHeaders() });
  }
}
