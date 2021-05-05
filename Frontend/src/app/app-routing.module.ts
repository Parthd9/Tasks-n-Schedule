import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ErrorPageComponent } from './error-page/error-page.component';
import { HomePageComponent } from './home-page/home-page.component';
import { KanbanComponent } from './kanban/kanban.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { LoginComponent } from './login/login.component';
import { ProjectComponent } from './project/project.component';
import { RegisterComponent } from './register/register.component';
import { SprintComponent } from './sprint/sprint.component';
import { VersionComponent } from './version/version.component';

const routes: Routes = [
  {path:'', component: LandingPageComponent,pathMatch:'full'},
  {path:'register', component: RegisterComponent},
  {path:'login', component: LoginComponent},
  {path:'project', component: HomePageComponent, children: [
    { path: '', component: ProjectComponent},
    { path: 'version', component: VersionComponent},
    { path: 'version/sprint', component: SprintComponent},
    { path: 'version/sprint/backlog', component: KanbanComponent}
  ]},
  {path:'**', component: ErrorPageComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
