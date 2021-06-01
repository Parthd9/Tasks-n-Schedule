import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/auth/auth.service';
import { SubtaskcompletionComponent } from '../modals/subtaskcompletion/subtaskcompletion.component';

@Component({
  selector: 'app-subtask',
  templateUrl: './subtask.component.html',
  styleUrls: ['./subtask.component.css']
})
export class SubtaskComponent implements OnInit {

  constructor(public dialog: MatDialog, private authService: AuthService) { }

  userRole = '';
  subtaskList=  [
    {desc: 'Subtask - 1', isCompleted: true},
    {desc: 'Subtask - 2', isCompleted: false},
    {desc: 'Subtask - 3', isCompleted: false},
    {desc: 'Subtask - 4', isCompleted: false},
    {desc: 'Subtask - 5', isCompleted: true},
    {desc: 'Subtask - 6', isCompleted: false}
  ];
  checked = false;
  ngOnInit(): void {
    this.authService.user.subscribe(user => {
      this.userRole = user['role'];
    });
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
}
