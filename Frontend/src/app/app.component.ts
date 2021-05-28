import { Component, DoCheck, OnInit } from '@angular/core';
import { ActivatedRoute, Data, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements DoCheck{
  title = 'tasks-n-schedule';
  url;
  flagHeader:boolean;
  flagFooter:boolean;
  constructor(private router: Router) {}

  ngDoCheck() {
    console.log('current url:',this.router.url);
    this.url = this.router.url;

    if(this.url === '/' || this.url === '/register' || this.url === '/payment' || this.url === '/login') {
      if(this.url !== '/') {
        this.flagFooter = true;
      }
      this.flagHeader = false;
    } else {
      this.flagHeader = true;
      this.flagFooter = true;
    }
    console.log('headerflg:',this.flagHeader+ ", footerflg:",this.flagFooter);
  }

}
