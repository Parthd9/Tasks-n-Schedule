import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AuthModule } from './auth/auth.module';
import { MaterialModule } from './material.module';
import { AdminModule } from './admin/admin.module';
import { ProjectsModule } from './projects/projects.module';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { ErrorPageComponent } from './error-page/error-page.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';


@NgModule({
  declarations: [
    AppComponent,
    LandingPageComponent,
    ErrorPageComponent,
    HeaderComponent,
    FooterComponent
  ],

  imports: [
    BrowserModule,
    AuthModule,
    AdminModule,
    ProjectsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MaterialModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
