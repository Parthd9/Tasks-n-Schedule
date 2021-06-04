import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmComponent } from 'src/app/shared/confirm/confirm.component';
import { ShowMessageComponent } from 'src/app/shared/show-message/show-message.component';
import { AdminService } from '../admin.service';
import { UpsertUserComponent } from '../upsert-user/upsert-user.component';

@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.css']
})
export class ManageUsersComponent implements OnInit {

  constructor(private dialog: MatDialog, private adminService: AdminService, private _snackBar: MatSnackBar) { }

  @ViewChild('searchUser') form: NgForm;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  durationInSeconds = 4;
  roles = ['Developer','Scrum Master', 'Assurance'];
  displayedColumns = ['name', 'email', 'role', 'actions'];
  data = [];
  dataSource;
  ngOnInit(): void {
    document.getElementById('userData').style.display='none';
    this.adminService.getUsers().subscribe(users => {
      this.data = users['body']['users'];
    })
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
    const dialogRef = this.dialog.open(UpsertUserComponent,dialogConfig);

    dialogRef.afterClosed().subscribe(data => {
      console.log('Dialog result:', data);
      if(data.event==='success') {
        this.data.push(data.value);
        console.log(data);
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
    let names=element.name.split("(")[0];
    names = names.split(" ");
    dialogConfig.data = {
      type: 'Update',
      userData: {fname: names[0], lname: names[1], email: element.email, role: element.role}
    };
    dialogConfig.width = '30%';
    dialogConfig.minWidth = '300px';
    const dialogRef = this.dialog.open(UpsertUserComponent,dialogConfig);

    dialogRef.afterClosed().subscribe(data => {
      console.log('Dialog result:', data);
      if(data.event==='Update') {
        const elem = this.data.find(p => p.email === element.email);
        let val = {...elem};
        console.log('val before:',val);
        val.name = data.value.fname+' '+data.value.lname;
        val.email = data.value.email;
        val.role = data.value.role;
        this.data[ind] = val;
        console.log('ind:',ind);
        console.log('val:',val)
        this.dataSource = new MatTableDataSource(this.data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    });
  }
  deleteUser(ind) {
 const dialogRef = this.dialog.open(ConfirmComponent, {
      width: '20%',
      minWidth: '300px',
      data: { message: 'Do you want to delete this user?' }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog result:', result);
      if(result.event==='yes') {
        this.data.splice(ind,1);
        this.dataSource = new MatTableDataSource(this.data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    });
  }
}
