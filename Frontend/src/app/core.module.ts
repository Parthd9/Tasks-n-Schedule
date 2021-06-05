import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { CommonDataService } from './services/common-data-service';
import { AuthInterceptorService } from './services/auth-interceptor.service';
import { AuthService } from './auth/auth.service';
import { AdminService } from './admin/admin.service';
import { ProjectsService } from './projects/projects.service';
import { TaskService } from './projects/task.service';


@NgModule({
  providers: [
    CommonDataService,
    AuthService,
    AdminService,
    ProjectsService,
    TaskService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true
    }
  ]
})
export class CoreModule {}
