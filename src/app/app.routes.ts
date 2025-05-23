import { Routes } from '@angular/router';
import { UserListComponent } from './user-list/user-list.component';
import { TrainingActivitiesComponent } from './training-activities/training-activities.component';
import { TrainingTeamSelfiesComponent } from './training-team-selfies/training-team-selfies.component';
import { TeamSelfiesComponent } from './team-selfies/team-selfies.component';
import { LoginComponent } from './login/login.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'user-list', component: UserListComponent },
  { path: 'training-activities', component: TrainingActivitiesComponent },
  { path: 'training-team-selfies', component: TrainingTeamSelfiesComponent },
  { path: 'team-selfies', component: TeamSelfiesComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];
