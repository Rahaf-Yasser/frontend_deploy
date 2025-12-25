import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { EventsService } from '../../services/event';

@Component({
  selector: 'app-search',
  standalone: true,
  templateUrl: './search.html',
  styleUrls: ['./search.css'],
  imports: [CommonModule, FormsModule, RouterModule]
})
export class SearchComponent implements OnInit {
  keyword: string = '';
  role: string = '';
  start: string = '';
  end: string = '';
  results: any[] = [];
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventsService: EventsService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.keyword = params['keyword'] || '';
      this.role = params['role'] || '';
      this.start = params['start'] || '';
      this.end = params['end'] || '';
      
      if (this.keyword || this.role || this.start || this.end) {
        this.search();
      }
    });
  }

  search() {
    this.loading = true;
    const query = {
      keyword: this.keyword.trim(),
      role: this.role,
      start: this.start,
      end: this.end
    };

    this.eventsService.searchEvents(query).subscribe({
      next: (res: any[]) => {
        this.results = res;
        this.loading = false;
      },
      error: (err: any) => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  clear() {
    this.keyword = '';
    this.role = '';
    this.start = '';
    this.end = '';
    this.results = [];
  }

  viewEvent(eventId: number) {
    this.router.navigate(['/events', eventId]);
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }
}