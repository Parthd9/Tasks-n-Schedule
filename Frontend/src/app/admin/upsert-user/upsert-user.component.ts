import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AdminService } from '../admin.service';

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
  showMsg = false;
  type;
  constructor(public dialogRef: MatDialogRef<UpsertUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private adminService: AdminService) { }

  @ViewChild('upsertUserForm') form: NgForm;
  roles = ['Developer', 'Scrum Master', 'Assurance','Admin'];
  ngOnInit(): void {
    console.log('userData:',this.data.userData);
    this.type = this.data.type;
    if(this.type === 'Update') {
      this.fnamedata = this.data.userData.firstName;
      this.lnamedata = this.data.userData.lastName;
      this.emaildata = this.data.userData.email;
      this.roledata = this.data.userData.role;
    }
  }

  upsert() {
    let userDoc;
    console.log(this.form.value);
    let obs;
    if(this.type == 'Add') {
      obs = this.adminService.addUser(this.form.value);
    } else {
      obs = this.adminService.editUser({...this.form.value, id: this.data.userData._id, email: this.emaildata});
    }
    obs.subscribe(result => {
      if(result) {
        if(result['status'] == 201 || result['status'] == 202) {
          if(this.type === 'Update') {
            userDoc = {_id: this.data.userData._id, fname: this.form.value.fname,lname: this.form.value.lname,
              email: this.data.userData.email,role: this.form.value.role};

            this.dialogRef.close({event:'success',value:userDoc});
          } else {
          this.dialogRef.close({event:'success',value:result['body']['user']});
          }
        }
      }
    }, err => {
      console.log('err:',err);
      this.showMsg = true;
      setTimeout(() => {
        this.showMsg = false;
      }, 4000)
  });
  }
  onNoClick() {
    this.dialogRef.close({event:'cancel'});
  }
}
