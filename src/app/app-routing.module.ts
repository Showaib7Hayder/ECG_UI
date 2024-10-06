import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DahboardComponent } from './components/dahboard/dahboard.component';
import { UploadComponent } from './components/upload/upload.component';
import { AnalyticsComponent } from './components/analytics/analytics.component';

const routes: Routes = [
  { path: 'dashboard', component: DahboardComponent },
  { path: 'upload', component: UploadComponent },
  { path: 'analytics', component: AnalyticsComponent },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: '/dashboard', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
