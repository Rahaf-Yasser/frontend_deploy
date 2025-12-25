import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AttendeeService {

  private apiUrl = "/api/attendees";

  constructor(private http: HttpClient) {}

  private auth() {
    return { headers: { Authorization: "Bearer " + localStorage.getItem("token") } };
  }

  invite(eventId: number, data: { email: string; role: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/${eventId}/invite`, data, this.auth());
  }

  updateStatus(eventId: number, status: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${eventId}/status`, { status }, this.auth());
  }

  getAttendees(eventId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${eventId}`, this.auth());
  }
}
