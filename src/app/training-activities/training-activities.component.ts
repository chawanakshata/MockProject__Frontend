import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { API_ENDPOINTS } from '../api-endpoints';

@Component({
  selector: 'app-training-activities',
  standalone: true, 
  imports: [CommonModule, MatSnackBarModule], 
  templateUrl: './training-activities.component.html',
  styleUrls: ['./training-activities.component.css']
})

export class TrainingActivitiesComponent implements OnInit {
  activities: any[] = [];
  errorMsg: string = '';

  constructor(private http: HttpClient, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.http.get<any[]>(API_ENDPOINTS.TRAINING_ACTIVITIES)
      .subscribe({
        next: data => {
        // Sorts the activities by their date, ascending order
        this.activities = data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        // Compare "2024-05-10" and "2024-05-08":	"2024-05-10" (a) - "2024-05-08" (b) → positive number → "2024-05-08" comes first.
        },
        error: (err) => {
        const errorMsg = err?.error?.Message || err?.error?.message || 'Failed to fetch activities.';
        this.snackBar.open(errorMsg, 'Close', {
          duration: 4000,
          verticalPosition: 'bottom',
          panelClass: 'photo-snackbar'
        });
      }
      });
  }

  // Group activities by week
  get activitiesByWeek() {
    const grouped: { [week: number]: any[] } = {}; //this object will store arrays of activities, one array for each week
    for (const activity of this.activities) {
      // Checks if there is already an array for its week in grouped.	If not, creates an empty array for that week and adds it to the correct week’s array.
      if (!grouped[activity.week]) grouped[activity.week] = [];
      grouped[activity.week].push(activity);
    }
      // grouped = {
      //   1: [ {week:1, activity-date:"2025-02-17 ", activity-day: 1, activity-desc: " "}, {week:1, activity-date:"2025-02-18 ", activity-day: 2, activity-desc: " "} ]

    return Object.entries(grouped)
      .sort(([a], [b]) => +a - +b); // sort by week number

      // [1, [ {week:1, activity-date:"2025-02-17 ", activity-day: 1, activity-desc: " "}, {week:1, activity-date:"2025-02-18 ", activity-day: 2, activity-desc: " "} ]]
  }
} 