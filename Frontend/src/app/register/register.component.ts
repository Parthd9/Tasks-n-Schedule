import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  Domain: any = ['Finance', 'HealthCare', 'Network', 'Manufacturing'];
  @ViewChild ('confirmPwd') confirmPwd: ElementRef;
  isPwdMatched = true;

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.createForm();
  }

  createForm() {
    this.registerForm = new FormGroup({
      // 'firstName': new FormControl(null, Validators.required),
      // 'lastName': new FormControl(null, Validators.required),
      'email': new FormControl(null, [Validators.email, Validators.required]),
      'password': new FormControl(null, [Validators.required, Validators.minLength(8)]),
      'orgName': new FormControl(null, [Validators.required, Validators.minLength(3), Validators.pattern('^$|^[A-Za-z]+')]),
      'orgDomain': new FormControl('', Validators.required)
    });
  }

  get f(){
    return this.registerForm.controls;
  }
  
  changeDomain(e) {
    console.log(e.target.value);
  }

  onSubmit() {
    console.log(this.registerForm.value);
    console.log(this.confirmPwd.nativeElement.value);
    console.log(this.registerForm.get('password').value);
    if(this.registerForm.invalid)
    {
      return;
    }
    if(this.confirmPwd.nativeElement.value !== this.registerForm.get('password').value)
    {
      this.isPwdMatched = false;
      setTimeout(() => {
        this.isPwdMatched = true;
      },4000);
      return;
    } 
    this.router.navigate(['/login']);
    this.registerForm.reset();
  }
}
