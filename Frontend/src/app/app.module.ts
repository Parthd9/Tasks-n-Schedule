import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ErrorPageComponent } from './error-page/error-page.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ProjectComponent } from './project/project.component';
import { AddProjectDialogComponent } from './modals/add-project-dialog/add-project-dialog.component';
import { KanbanComponent } from './kanban/kanban.component';
import { AddBacklogComponent } from './modals/add-backlog/add-backlog.component';
import { ConfirmComponent } from './modals/confirm/confirm.component';
import { VersionComponent } from './version/version.component';
import { SprintComponent } from './sprint/sprint.component';
import { VisualChartComponent } from './visual-chart/visual-chart.component';
import { AdminPageComponent } from './admin/admin-page/admin-page.component';
import { PieChartComponent } from './admin/pie-chart/pie-chart.component';
import { BarChartComponent } from './admin/bar-chart/bar-chart.component';
import { ManageUsersComponent } from './admin/manage-users/manage-users.component';
import { UpsertUserComponent } from './admin/upsert-user/upsert-user.component';
import { EmailComponent } from './modals/email/email.component';

import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button'
import {MatIconModule} from '@angular/material/icon';
import {MatCardModule} from '@angular/material/card';
import {MatTabsModule} from '@angular/material/tabs';
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatDialogModule } from "@angular/material/dialog";
import { MatInputModule } from "@angular/material/input";
import { MatListModule } from "@angular/material/list";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatSelectModule } from "@angular/material/select";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatSortModule } from "@angular/material/sort";
import { MatTableModule } from "@angular/material/table";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectFilterModule } from 'mat-select-filter';
import {MatBadgeModule} from '@angular/material/badge';
import { ChartsModule } from 'ng2-charts';





@NgModule({
  declarations: [
    AppComponent,
    LandingPageComponent,
    LoginComponent,
    RegisterComponent,
    ErrorPageComponent,
    HomePageComponent,
    HeaderComponent,
    FooterComponent,
    ProjectComponent,
    AddProjectDialogComponent,
    VersionComponent,
    KanbanComponent,
    AddBacklogComponent,
    ConfirmComponent,
    SprintComponent,
    VisualChartComponent,
    AdminPageComponent,
    PieChartComponent,
    BarChartComponent,
    ManageUsersComponent,
    UpsertUserComponent,
    EmailComponent
  ],

  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    BrowserAnimationsModule,
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatTabsModule,
    MatDatepickerModule,
    MatDialogModule,
    MatInputModule,
    MatListModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatSidenavModule,
    MatSortModule,
    MatTableModule,
    MatToolbarModule,
    MatTooltipModule,
    MatSelectFilterModule,
    MatBadgeModule,
    ChartsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
