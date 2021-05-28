import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { CommonDataService } from './services/common-data-service';


@NgModule({
  providers: [
    CommonDataService
    // {
    //   provide: HTTP_INTERCEPTORS,
    //   useClass: AuthInterceptorService,
    //   multi: true
    // }
  ]
})
export class CoreModule {}
