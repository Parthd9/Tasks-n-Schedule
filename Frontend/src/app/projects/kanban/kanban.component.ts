import { Component, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { ShowMessageComponent } from 'src/app/shared/show-message/show-message.component';
import { ConfirmComponent } from '../../shared/confirm/confirm.component';
import { AddBacklogComponent } from '../modals/add-backlog/add-backlog.component';
import { TaskService } from '../task.service';

@Component({
  selector: 'app-kanban',
  templateUrl: './kanban.component.html',
  styleUrls: ['./kanban.component.css']
})
export class KanbanComponent implements OnInit {
  userRole = '';
  ind;
  durationInSeconds = 4;
  todo = [];
  inprogress = [];
  completed = [];
  developers;

  constructor(public dialog: MatDialog, private router: Router, private currentRoute:ActivatedRoute, private authService: AuthService,
              private taskService: TaskService, private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.authService.user.subscribe(user => {
      this.userRole = user['role'];
    })
    this.taskService.getBacklogs().subscribe(result => {
      console.log(result);
      this.todo = result['body']['backlogs'];
    })

    this.taskService.getDevelopers().subscribe(result => {
      console.log(result);
      this.developers = result['body']['developers'];
    })
  }
  openDialog() {
    const dialogRef = this.dialog.open(AddBacklogComponent, {
      width: '40%',
      minWidth: '300px',
      data: { name: 'TnS', developers: this.developers }
    });
    dialogRef.afterClosed().subscribe(data => {
      console.log('Dialog result:', data);
      if(data.event === 'success') {
        this.todo.push(data.value);
        this._snackBar.openFromComponent(ShowMessageComponent, {
          duration: this.durationInSeconds * 1000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['success'],
          data: {type: 'success', msg: 'backlog added successfully.'}
        });
      }
    });
  }
  removeBacklog(ind) {
    const dialogRef = this.dialog.open(ConfirmComponent, {
      width: '20%',
      minWidth: '300px',
      data: { message: 'Do you want to remove this backlog?' }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog result:', result);
      if(result.event === 'yes') {
        this.todo.splice(ind,1);
      }
    });
  }

  onViewBackLog(id) {
    console.log("onViewBacklog called");
    this.router.navigate(['subtask'],{relativeTo:this.currentRoute, queryParams: {taskId: id, status:'backlog'}, queryParamsHandling: "merge"});
  }
  onViewProgressTask(index) {
    console.log("onViewProgressTaskcalled");
    this.router.navigate(['subtask'],{relativeTo:this.currentRoute, queryParams: {taskId: index, status:'inProgress'}, queryParamsHandling: "merge"});
  }
  onViewCompletedTask(index) {
    console.log("onViewCompletedTask called");
    this.router.navigate(['subtask'],{relativeTo:this.currentRoute, queryParams: {taskId: index, status: 'completed'}, queryParamsHandling: "merge"});
  }
}
