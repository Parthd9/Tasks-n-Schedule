import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-upsert-user',
  templateUrl: './upsert-user.component.html',
  styleUrls: ['./upsert-user.component.css']
})
export class UpsertUserComponent implements OnInit {


  fnamedata = '';
  lnamedata = '';
  emaildata = '';
  roledata = '';

  constructor(public dialogRef: MatDialogRef<UpsertUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  @ViewChild('upsertUserForm') form: NgForm;
  roles = ['Developer', 'Scrum Master', 'Assurance'];
  ngOnInit(): void {
    console.log('userData:',this.data.userData);
    this.fnamedata = this.data.userData.fname;
    this.lnamedata = this.data.userData.lname;
    this.emaildata = this.data.userData.email;
    this.roledata = this.data.userData.role;
  }

  upsert() {
    console.log(this.form.value);
    this.dialogRef.close({event: this.data.type,value:this.form.value});
  }
  onNoClick() {
    this.dialogRef.close({event:'cancel'});
  }
}
