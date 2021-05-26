import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonDataService } from '../common-data-service';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  selectedValue="";
  Domain: any = ['Finance', 'HealthCare', 'Network', 'Manufacturing'];
  @ViewChild ('confirmPwd') confirmPwd: ElementRef;
  isPwdMatched = true;

  constructor(private router: Router, private dataService: CommonDataService) { }

  preservedData;
  ngOnInit(): void {
    this.createForm();

    this.dataService.userData.subscribe(result => {
      this.preservedData=result;
    });
    if(this.preservedData) {
      console.log('preserved:',this.preservedData);
      this.registerForm.patchValue({
        fName: this.preservedData.fName,
        lName: this.preservedData.lName,
        email: this.preservedData.email,
        password: null,
        orgName: this.preservedData.orgName,
        orgDomain: this.preservedData.orgDomain,
      });
    }
  }

  createForm() {
    this.registerForm = new FormGroup({
      'fName': new FormControl(null, Validators.required),
      'lName': new FormControl(null, Validators.required),
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
    console.log(this.registerForm);
    console.log(this.registerForm.value);
    console.log(this.confirmPwd.nativeElement.value);
    console.log(this.registerForm.get('password').value);
    if(this.registerForm.invalid)
    {
      return;
    }
    if(this.confirmPwd.nativeElement.value !== this.registerForm.get('password').value)
    {
      console.log('not true');
      this.isPwdMatched = false;
       setTimeout(() => {
         this.isPwdMatched = true;
       },4000);
      return;
    }
    this.dataService.setData(this.registerForm.value);
    this.router.navigate(['/payment']);
    this.registerForm.reset();
  }
}
