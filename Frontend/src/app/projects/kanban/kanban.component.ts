import { Component, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { ConfirmComponent } from '../../shared/confirm/confirm.component';
import { AddBacklogComponent } from '../modals/add-backlog/add-backlog.component';

@Component({
  selector: 'app-kanban',
  templateUrl: './kanban.component.html',
  styleUrls: ['./kanban.component.css']
})
export class KanbanComponent implements OnInit {
  userRole = '';
  ind;
  todo = [
    {task: 'sample task 1', date: '03-05-2021'},
    {task: 'sample task 2', date: '03-05-2021'},
    {task: 'sample task 3', date: '03-05-2021'},
    {task: 'sample task 4', date: '03-05-2021'},
    {task: 'sample task 5', date: '03-05-2021'},
    {task: 'sample task 6', date: '03-05-2021'},
    {task: 'sample task 7', date: '03-05-2021'},
    {task: 'sample task 8', date: '03-05-2021'},
    {task: 'sample task 9', date: '03-05-2021'},
    {task: 'sample task 10', date: '03-05-2021'},
    {task: 'sample task 11', date: '03-05-2021'},
    {task: 'sample task 12', date: '03-05-2021'},
    {task: 'sample task 13', date: '03-05-2021'}
  ];

  inprogress = [
    {task: 'sample task 1', date: '03-05-2021'},
    {task: 'sample task 2', date: '03-05-2021'},
    {task: 'sample task 3', date: '03-05-2021'},
    {task: 'sample task 4', date: '03-05-2021'},
    {task: 'sample task 5', date: '03-05-2021'},
    {task: 'sample task 6', date: '03-05-2021'},
    {task: 'sample task 7', date: '03-05-2021'},
    {task: 'sample task 8', date: '03-05-2021'},
    {task: 'sample task 9', date: '03-05-2021'},
    {task: 'sample task 10', date: '03-05-2021'},
    {task: 'sample task 11', date: '03-05-2021'},
    {task: 'sample task 12', date: '03-05-2021'},
    {task: 'sample task 13', date: '03-05-2021'}
  ];
  completed = [
    {task: 'sample task 1', date: '03-05-2021'},
    {task: 'sample task 2', date: '03-05-2021'},
    {task: 'sample task 3', date: '03-05-2021'},
    {task: 'sample task 4', date: '03-05-2021'},
    {task: 'sample task 5', date: '03-05-2021'},
    {task: 'sample task 6', date: '03-05-2021'},
    {task: 'sample task 7', date: '03-05-2021'},
    {task: 'sample task 8', date: '03-05-2021'},
    {task: 'sample task 9', date: '03-05-2021'},
    {task: 'sample task 10', date: '03-05-2021'},
    {task: 'sample task 11', date: '03-05-2021'},
    {task: 'sample task 12', date: '03-05-2021'},
    {task: 'sample task 13', date: '03-05-2021'}
  ];

  constructor(public dialog: MatDialog, private router: Router, private currentRoute:ActivatedRoute, private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.user.subscribe(user => {
      this.userRole = user['role'];
    })
  }
  openDialog() {
    const dialogRef = this.dialog.open(AddBacklogComponent, {
      width: '40%',
      minWidth: '300px',
      data: { name: 'TnS' }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog result:', result);
      if(result.event === 'save') {
        this.todo.push({task: result.data.description, date:'04-05-2021'});
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

  onViewBackLog(index) {
    console.log("onViewBacklog called");
    this.router.navigate(['subtask'],{relativeTo:this.currentRoute, queryParams: {taskId: index, status:'backlog'}, queryParamsHandling: "merge"});
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
