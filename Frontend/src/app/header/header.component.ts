import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private _location: Location) { }

  show = false;
  toggleClicked = false;
  ngOnInit(): void {
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
