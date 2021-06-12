import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormControl, NgForm, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TaskService } from '../../task.service';

@Component({
  selector: 'app-subtaskcompletion',
  templateUrl: './subtaskcompletion.component.html',
  styleUrls: ['./subtaskcompletion.component.css']
})
export class SubtaskcompletionComponent implements OnInit {

  subtaskId;
  showMsg = false;
  taskDetails;
  constructor( public dialogRef: MatDialogRef<SubtaskcompletionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private taskService: TaskService) {
      this.subtaskId = data.id;
      this.taskDetails = data.taskDetails;
    }

  ngOnInit(): void {
  }

  @ViewChild('subtaskcomplete') form: NgForm;

  onSubmit() {
    this.taskService.onSubtaskCompletion({id: this.subtaskId, completionTime: this.form.value.complete,taskDetails:this.taskDetails}).subscribe(result => {
      // console.log(result);
      if(result['status']===200) {
        this.dialogRef.close({event:'save',status: result['body']['status']});
      }
    }, err => {
      console.log('err:',err);
      this.showMsg = true;
      setTimeout(() => {
        this.showMsg = false;
      }, 4000)
  })
  }
  onNoClick(): void {
    this.dialogRef.close({event:'cancel'});
  }
}
