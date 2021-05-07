import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private _location: Location, private currentRoute: ActivatedRoute) { }

  show = false;
  toggleClicked = false;
  link;
  ngOnInit(): void {
    // console.log(this.currentRoute.snapshot.queryParams);
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
      } else {
        this.link = '';
        // history.pushState(null, null, location.href);
        // window.onpopstate = function () {
        //     history.go(1);
        // };
      }
    })
  }

  onToggle() {
    document.getElementById('navbarNav').style.display = document.getElementById('navbarNav').style.display === 'block' ? 'none' : 'block';
    this.toggleClicked=true;
    this.show = !this.show;
  }
  onBack() {
    this._location.back();
  }
}
