import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { TaskService } from '../../task.service';

@Component({
  selector: 'app-add-subtask',
  templateUrl: './add-subtask.component.html',
  styleUrls: ['./add-subtask.component.css']
})
export class AddSubtaskComponent implements OnInit {
  @ViewChild('addSubtaskForm',{static: true}) subtaskForm: NgForm;
  maxChars = 200;
  showMsg = false;
  constructor(private dialogRef: MatDialogRef<AddSubtaskComponent>, private taskService: TaskService) { }

  ngOnInit(): void {
  }

  onSubmit() {
    // this.dialogRef.close({event:'save',value:this.projectForm.value});
    this.taskService.addSubtask(this.subtaskForm.value).subscribe(result => {
      if(result['status'] == 201) {
        console.log('success');
        console.log(result['body']['subtask']);
        this.dialogRef.close({event:'success',value:result['body']['subtask']});
      }
    },
    err => {
      console.log('err:',err);
      this.showMsg = true;
      setTimeout(() => {
        this.showMsg = false;
      }, 4000)
  })
}

  close() {
    this.dialogRef.close({event: 'close'});
  }

}
