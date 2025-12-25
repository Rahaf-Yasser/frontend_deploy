import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private apiUrl = '/api/search';

  constructor(private http: HttpClient) {}

  search(params: any): Observable<any> {
    return this.http.get(this.apiUrl, { params });
  }
}
