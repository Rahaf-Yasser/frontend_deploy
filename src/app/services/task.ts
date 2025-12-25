import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private baseUrl = '/api/tasks';

  constructor(private http: HttpClient) {}

  private authHeader() {
    return { headers: new HttpHeaders({ Authorization: `Bearer ${localStorage.getItem('token')}` }) };
  }

  addTask(eventId: number, data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/${eventId}/tasks`, data, this.authHeader());
  }

  getTasks(eventId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${eventId}/tasks`, this.authHeader());
  }

  updateTask(taskId: number, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${taskId}`, data, this.authHeader());
  }

  deleteTask(taskId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${taskId}`, this.authHeader());
  }
}
