import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ErrorPageComponent } from './error-page/error-page.component';
import { LandingPageComponent } from './landing-page/landing-page.component';

const routes: Routes = [
  {path:'', component: LandingPageComponent,pathMatch:'full'},
  // {path:'main/register', component: RegisterComponent},
  // {path:'main/payment', component: PaymentComponent},
  // {path:'main/login', component: LoginComponent},
  // {path:'main/admin', component: AdminPageComponent},
  // {path:'main/admin/manage-users', component: ManageUsersComponent},
  // { path: 'visual-chart', component: VisualChartComponent}
  // {path:'project', component: HomePageComponent, children: [
  //   { path: '', component: ProjectComponent},
  //   { path: 'version', component: VersionComponent},
  //   { path: 'version/sprint', component: SprintComponent},
  //   { path: 'version/sprint/backlog', component: KanbanComponent},
  //   { path: 'version/sprint/backlog/subtask', component: SubtaskComponent},
  // ]},
  {path:'**', component: ErrorPageComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
