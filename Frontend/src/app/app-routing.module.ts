import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminPageComponent } from './admin/admin-page/admin-page.component';
import { ManageUsersComponent } from './admin/manage-users/manage-users.component';
import { ErrorPageComponent } from './error-page/error-page.component';
import { HomePageComponent } from './home-page/home-page.component';
import { KanbanComponent } from './kanban/kanban.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { LoginComponent } from './login/login.component';
import { PaymentComponent } from './payment/payment.component';
import { ProjectComponent } from './project/project.component';
import { RegisterComponent } from './register/register.component';
import { SprintComponent } from './sprint/sprint.component';
import { SubtaskComponent } from './subtask/subtask.component';
import { VersionComponent } from './version/version.component';
import { VisualChartComponent } from './visual-chart/visual-chart.component';

const routes: Routes = [
  {path:'', component: LandingPageComponent,pathMatch:'full'},
  {path:'register', component: RegisterComponent},
  {path:'payment', component: PaymentComponent},
  {path:'login', component: LoginComponent},
  {path:'admin', component: AdminPageComponent},
  {path:'admin/manage-users', component: ManageUsersComponent},
  {path:'project', component: HomePageComponent, children: [
    { path: '', component: ProjectComponent},
    { path: 'version', component: VersionComponent},
    { path: 'version/sprint', component: SprintComponent},
    { path: 'version/sprint/backlog', component: KanbanComponent},
    { path: 'version/sprint/backlog/subtask', component: SubtaskComponent},
    { path: 'visual-chart', component: VisualChartComponent}
  ]},
  {path:'**', component: ErrorPageComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
