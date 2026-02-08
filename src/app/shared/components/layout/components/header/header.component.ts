import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatToolbarModule, MatIconModule, MatMenuModule, MatButtonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  headerTitle = 'LiftMate';
  linksConfig = [
    {
      id: 'link-exercises',
      path: 'exercises',
      label: 'Exercises',
      icon: 'fitness_center',
    },
    {
      id: 'link-routines',
      path: 'routines',
      label: 'Routines',
      icon: 'checklist',
    },
    {
      id: 'link-workout',
      path: 'workout',
      label: 'Workout',
      icon: 'play_arrow',
    },
    {
      id: 'link-history',
      path: 'history',
      label: 'History',
      icon: 'history',
    },

  ];
}
