import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AuthService } from 'src/app/auth/auth.service';
import { ConfirmComponent } from 'src/app/shared/confirm/confirm.component';
import { ShowMessageComponent } from 'src/app/shared/show-message/show-message.component';
import { AdminService } from '../admin.service';
import { UploadDataComponent } from '../upload-data/upload-data.component';
import { UpsertUserComponent } from '../upsert-user/upsert-user.component';

@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.css']
})
export class ManageUsersComponent implements OnInit {

  constructor(private dialog: MatDialog, private adminService: AdminService, private _snackBar: MatSnackBar, private authService: AuthService) { }

  @ViewChild('searchUser') form: NgForm;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  durationInSeconds = 4;
  roles = ['Admin','Developer','Scrum Master', 'Assurance'];
  displayedColumns = ['name', 'email', 'role', 'actions'];
  data = [];
  dataSource;
  userRole;
  ngOnInit(): void {
    document.getElementById('userData').style.display='none';
    this.adminService.getUsers().subscribe(users => {
      this.data = users['body']['users'];
    })
    this.authService.user.subscribe(user => {
      this.userRole = user['role'];
    });
  }

  onSearch() {
    this.dataSource = new MatTableDataSource(this.data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    document.getElementById('userData').style.display='block';
  }
  onReset() {
    this.form.reset();
  }
  openAddUser() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      type: 'Add'
    };
    dialogConfig.width = '30%';
    dialogConfig.minWidth = '300px';
    dialogConfig.disableClose = true;
    const dialogRef = this.dialog.open(UpsertUserComponent,dialogConfig);

    dialogRef.afterClosed().subscribe(data => {
      // console.log('Dialog result:', data);
      if(data.event==='success') {
        this.data.push(data.value);
        this.dataSource = new MatTableDataSource(this.data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this._snackBar.openFromComponent(ShowMessageComponent, {
          duration: this.durationInSeconds * 1000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['success'],
          data: {type: 'success', msg: 'User added successfully.'}
        });
      }
    });
  }
  editUser(element,ind) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      type: 'Update',
      userData: element
    };
    dialogConfig.width = '30%';
    dialogConfig.minWidth = '300px';
    const dialogRef = this.dialog.open(UpsertUserComponent,dialogConfig);

    dialogRef.afterClosed().subscribe(data => {
      if(data.event==='success') {
        const elem = this.data.find(p => p._id === element._id);
        const index = this.data.findIndex(p => p._id === element._id);
        let val = {...elem};
        val.firstName = data.value.fname;
        val.lastName = data.value.lname;
        val.email = data.value.email;
        val.role = data.value.role;
        this.data[index] = val;
        this.dataSource = new MatTableDataSource(this.data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

        this._snackBar.openFromComponent(ShowMessageComponent, {
          duration: this.durationInSeconds * 1000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['success'],
          data: {type: 'success', msg: 'User updated successfully.'}
        });
      }
    });
  }
  deleteUser(element,ind) {
 const dialogRef = this.dialog.open(ConfirmComponent, {
      width: '20%',
      minWidth: '300px',
      data: { message: 'Do you want to delete this user?' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result.event==='yes') {
        this.adminService.removeUser({id: element._id, email: element.email}).subscribe(result => {
          if(result['status'] == 200) {
            const index = this.data.findIndex(p => p._id === element._id);
            this.data.splice(index,1);
            this.dataSource = new MatTableDataSource(this.data);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
            this._snackBar.openFromComponent(ShowMessageComponent, {
              duration: this.durationInSeconds * 1000,
              horizontalPosition: 'right',
              verticalPosition: 'top',
              panelClass: ['success'],
              data: {type: 'success', msg: 'User deleted successfully.'}
            });
          }
        })
      }
    });
  }

  openCSVupload() {
    const dialogRef = this.dialog.open(UploadDataComponent);
    dialogRef.afterClosed().subscribe(result => {

    });
  }
}
