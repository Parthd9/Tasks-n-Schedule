import { Location } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private _location: Location, private currentRoute: ActivatedRoute, private authService: AuthService) { }

  show = false;
  toggleClicked = false;
  showNotification = false;
  role = '';
  link;
  ngOnInit(): void {
    // console.log(this.currentRoute.snapshot.queryParams);
    this.authService.user.subscribe(user => {
      this.role = user['role'];
    });
    this.currentRoute.queryParams.subscribe(params => {
      console.log(Object.keys(params).length);
      if(Object.keys(params).length === 1)
      {
        this.link = 'Back To Project';
        // console.log(this.link);
      } else if(Object.keys(params).length == 2) {
        this.link = 'Back To Version';
      } else if(Object.keys(params).length == 3) {
        this.link = 'Back To Sprint';
      } else if(Object.keys(params).length == 5) {
        this.link = 'Back To Backlog';
      } else {
        this.link = '';
        // history.pushState(null, null, location.href);
        // window.onpopstate = function () {
        //     history.go(1);
        // };
      }
    })

    if(window.innerWidth < 992) {
      this.showNotification = true;
    }
  }

  logout() {
    this.authService.logout();
  }

  onToggle() {
    document.getElementById('navbarNav').style.display = document.getElementById('navbarNav').style.display === 'block' ? 'none' : 'block';
    this.toggleClicked=true;
    this.show = !this.show;
  }
  onBack() {
    this._location.back();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    if(window.innerWidth < 992) {
      this.showNotification = true;
    } else {
      this.showNotification = false;
    }
  }
}
