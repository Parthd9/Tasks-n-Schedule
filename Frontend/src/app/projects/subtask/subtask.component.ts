import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/auth/auth.service';
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
  checked = false;
  durationInSeconds = 4;

  ngOnInit(): void {
    this.authService.user.subscribe(user => {
      this.userRole = user['role'];
    });
    this.taskService.getSubtasks().subscribe(result => {
      console.log(result);
      this.subtaskList = result['body']['subtasks'];
    })
  }

  onComplete(data, ind) {
    console.log('checkbox:',data);
    if(data===true) {
      const dialogRef = this.dialog.open(SubtaskcompletionComponent, {
        width: '30%',
        minHeight: '300px'
        // data: { message: 'Please enter total time taken to complete the subtask.', subTaskCompletion: true }
      });
      dialogRef.afterClosed().subscribe(result => {
        console.log('Dialog result:', result);
        if(result.event === 'yes') {
          this.subtaskList[ind].isCompleted = true;
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
    const dialogRef = this.dialog.open(AddSubtaskComponent,dialogConfig);

    dialogRef.afterClosed().subscribe(data => {
      console.log('Dialog result:', data);
      if(data.event === 'success') {
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

}
