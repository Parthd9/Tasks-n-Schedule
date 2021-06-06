import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/auth/auth.service';
import { ConfirmComponent } from 'src/app/shared/confirm/confirm.component';
import { ShowMessageComponent } from 'src/app/shared/show-message/show-message.component';
import { AddSubtaskComponent } from '../modals/add-subtask/add-subtask.component';
import { SubtaskcompletionComponent } from '../modals/subtaskcompletion/subtaskcompletion.component';
import { TaskService } from '../task.service';

@Component({
  selector: 'app-subtask',
  templateUrl: './subtask.component.html',
  styleUrls: ['./subtask.component.css']
})
export class SubtaskComponent implements OnInit {

  constructor(public dialog: MatDialog, private authService: AuthService, private taskService: TaskService, private _snackBar: MatSnackBar) { }

  userRole = '';
  subtaskList=  [];
  taskDetails;
  checked = false;
  durationInSeconds = 4;
  status;

  ngOnInit(): void {
    this.authService.user.subscribe(user => {
      this.userRole = user['role'];
    });
    this.taskService.getSubtasks().subscribe(result => {
      console.log(result);
      this.subtaskList = result['body']['subtasks'];
      this.taskDetails = result['body']['taskDetails'][0];
      this.status = result['body']['taskDetails'][0]['status'];
    })
  }

  onComplete(data, item, ind) {
    console.log('checkbox:',data);
    if(data===true) {
      const dialogRef = this.dialog.open(SubtaskcompletionComponent, {
        width: '30%',
        minHeight: '300px',
        data: {id: item._id}
        // data: { message: 'Please enter total time taken to complete the subtask.', subTaskCompletion: true }
      });
      dialogRef.afterClosed().subscribe(result => {
        console.log('Dialog result:', result);
        if(result.event === 'save') {
          this.subtaskList[ind].isCompleted = true;
          this.status = result['status'];
        }
      });
    }
  }

  openDialog() {
    const dialogConfig = new MatDialogConfig();
    // dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '30%';
    dialogConfig.minWidth = '300px';
    dialogConfig.data = {isEdit: false}
    const dialogRef = this.dialog.open(AddSubtaskComponent,dialogConfig);

    dialogRef.afterClosed().subscribe(data => {
      console.log('Dialog result:', data);
      if(data.event === 'success') {
          this.status = data.value['taskStatus'];
          delete data.value['taskStatus'];
          console.log('remaining:',data.value);
          this.subtaskList.push(data.value);
          this._snackBar.openFromComponent(ShowMessageComponent, {
            duration: this.durationInSeconds * 1000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
            panelClass: ['success'],
            data: {type: 'success', msg: 'Subtask added successfully.'}
          });
      }
    });
  }

  onSubtaskEdit(item) {
    const dialogConfig = new MatDialogConfig();
    // dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '30%';
    dialogConfig.minWidth = '300px';
    dialogConfig.data = {isEdit: true, subtask: item}
    const dialogRef = this.dialog.open(AddSubtaskComponent,dialogConfig);

    dialogRef.afterClosed().subscribe(data => {
      console.log('Dialog result:', data);
      if(data.event === 'success') {
        const ind = this.subtaskList.findIndex(p =>{ return p._id===item._id});
        this.subtaskList[ind]['description'] = data.value;
        this._snackBar.openFromComponent(ShowMessageComponent, {
          duration: this.durationInSeconds * 1000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['success'],
          data: {type: 'success', msg: 'Subtask updated successfully.'}
        });
      }
    });
  }

  onRemoveSubtask(item) {
    const dialogRef = this.dialog.open(ConfirmComponent, {
      width: '20%',
      minWidth: '300px',
      data: { message: 'Do you want to remove this subtask?' }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog result:', result);
      if(result.event === 'yes') {
        this.taskService.removeSubtask({id:item._id}).subscribe(result => {
          console.log('result remove:',result);
          if(result['status'] === 200) {
            const ind = this.subtaskList.findIndex(p =>{ return p._id===item._id});
            this.subtaskList.splice(ind, 1);
            this.status = result['body']['status'];
            this._snackBar.openFromComponent(ShowMessageComponent, {
              duration: this.durationInSeconds * 1000,
              horizontalPosition: 'right',
              verticalPosition: 'top',
              panelClass: ['success'],
              data: {type: 'success', msg: 'Subtask removed successfully.'}
            });
          }
        });
      }
    });
  }

}
