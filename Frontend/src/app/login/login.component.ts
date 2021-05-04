import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private router: Router) { }

  @ViewChild('f') loginForm: NgForm;
  ngOnInit(): void {
  }

  onLogin() {
    if(this.loginForm.invalid) {
      return;
    }
    console.log(this.loginForm.value);
    this.loginForm.reset();
    this.router.navigate(['/project']);
  }

}
