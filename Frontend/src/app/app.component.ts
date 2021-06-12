import { Component, DoCheck, OnChanges, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Location } from "@angular/common";
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements DoCheck, OnInit{
  title = 'tasks-n-schedule';
  url;
  flagHeader:boolean;
  flagFooter:boolean;
  constructor(private router: Router, private location: Location,private authService: AuthService) {
    router.events.subscribe(val => {
      if (val instanceof NavigationEnd) {
        this.url = this.router.url;
        if(this.url === '/' || this.url === '/register' || this.url === '/payment' || this.url === '/login') {
          this.flagHeader = false;
          if(this.url !== '/') {
            // this.authService.user.subscribe(user => {
            //   if(user) {
            //     console.log('calling logout');
            //     this.authService.logout();
            //   }
            // })
            this.flagFooter = true;
          } else {
            this.flagFooter = false;
          }
        } else {
          this.flagHeader = true;
          this.flagFooter = true;
        }
      } else {
        // this.route = "Home";
        console.log('In else');
      }
    });
  }

  ngOnInit() {
    this.authService.autoLogin();
  }

  ngDoCheck() {
    // console.log('current url:',this.router.url);
    // this.url = this.router.url;

    // if(this.url === '/' || this.url === '/register' || this.url === '/payment' || this.url === '/login') {
    //   if(this.url !== '/') {
    //     // this.authService.user.subscribe(user => {
    //     //   if(user) {
    //     //     console.log('calling logout');
    //     //     this.authService.logout();
    //     //   }
    //     // })
    //     this.flagFooter = true;
    //   }
    //   this.flagHeader = false;
    // } else {
    //   this.flagHeader = true;
    //   this.flagFooter = true;
    // }
    // console.log('headerflg:',this.flagHeader+ ", footerflg:",this.flagFooter);
  }
}
