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
  tasks = [];
  todo = [];
  inprogress = [];
  completed = [];
  developers;

  constructor(public dialog: MatDialog, private router: Router, private currentRoute:ActivatedRoute, private authService: AuthService,
              private taskService: TaskService, private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.authService.user.subscribe(user => {
      this.userRole = user['role'];
    });
    this.taskService.getBacklogs().subscribe(result => {
      this.tasks = result['body']['backlogs'];
      this.todo = this.tasks.filter(task => {
        return task['status'] === 'Backlog';
      });
      this.inprogress = this.tasks.filter(task => {
        return task['status'] === 'In-Progress';
      });
      this.completed = this.tasks.filter(task => {
        return task['status'] === 'Completed';
      });
    });

    // console.log('todo:',this.todo);
    // console.log('inprogress:',this.inprogress);
    // console.log('completed:',this.completed);
    this.taskService.getDevelopers().subscribe(result => {
      this.developers = result['body']['developers'];
    });
  }
  openDialog() {
    const dialogRef = this.dialog.open(AddBacklogComponent, {
      width: '40%',
      minWidth: '300px',
      data: { name: 'TnS', developers: this.developers, header:'Add Backlog' }
    });
    dialogRef.afterClosed().subscribe(data => {
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

  onEditTask(item) {
    const dialogRef = this.dialog.open(AddBacklogComponent, {
      width: '40%',
      minWidth: '300px',
      data: { isEdit: true,taskDetail: item, developers: this.developers, selectedList: item.developers, header: 'Edit Backlog' }
    });
    dialogRef.afterClosed().subscribe(data => {
      if(data.event === 'success') {

        if(data.status === 'Backlog') {
          const ind = this.todo.findIndex(p => {return p._id === item._id});
          let doc = {...data.value, createdAt: item.createdAt};
          this.todo[ind] = doc;
        } else {
          const ind = this.inprogress.findIndex(p => {return p._id === item._id});
          let doc = {...data.value, createdAt: item.createdAt};
          this.inprogress[ind] = doc;
        }


        this._snackBar.openFromComponent(ShowMessageComponent, {
          duration: this.durationInSeconds * 1000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['success'],
          data: {type: 'success', msg: 'Task updated successfully.'}
        });
      }
    });
  }
  removeBacklog(item) {
    const dialogRef = this.dialog.open(ConfirmComponent, {
      width: '20%',
      minWidth: '300px',
      data: { message: 'Do you want to remove this backlog?' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result.event === 'yes') {
        this.taskService.removeBacklog({id: item._id}).subscribe(result => {
          if(result['status'] == 200) {
            const ind = this.todo.findIndex(p =>{ return p._id===item._id});
            this.todo.splice(ind,1);
            this._snackBar.openFromComponent(ShowMessageComponent, {
              duration: this.durationInSeconds * 1000,
              horizontalPosition: 'right',
              verticalPosition: 'top',
              panelClass: ['success'],
              data: {type: 'success', msg: 'Task removed successfully.'}
            });
          }
        })
      }
    });
  }

  onViewBackLog(id) {
    this.router.navigate(['subtask'],{relativeTo:this.currentRoute, queryParams: {taskId: id, status:'backlog'}, queryParamsHandling: "merge"});
  }
  onViewProgressTask(id) {
    this.router.navigate(['subtask'],{relativeTo:this.currentRoute, queryParams: {taskId: id, status:'inProgress'}, queryParamsHandling: "merge"});
  }
  onViewCompletedTask(id) {
    this.router.navigate(['subtask'],{relativeTo:this.currentRoute, queryParams: {taskId: id, status: 'completed'}, queryParamsHandling: "merge"});
  }
}
