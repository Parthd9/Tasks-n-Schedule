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

  constructor(public dialogRef: MatDialogRef<UpsertUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private adminService: AdminService) { }

  @ViewChild('upsertUserForm') form: NgForm;
  roles = ['Developer', 'Scrum Master', 'Assurance'];
  ngOnInit(): void {
    console.log('userData:',this.data.userData);
    if(this.data.type === 'Add') {
      this.fnamedata = this.data.userData.fname;
      this.lnamedata = this.data.userData.lname;
      this.emaildata = this.data.userData.email;
      this.roledata = this.data.userData.role;
    }
  }

  upsert() {
    console.log(this.form.value);
    this.adminService.addUser(this.form.value).subscribe(result => {
      if(result) {
        if(result['status'] == 201) {
          this.dialogRef.close({event:'success',value:result['body']['user']});
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
