import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
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
  description = '';
  isEdit;
  subtaskId;
  constructor(private dialogRef: MatDialogRef<AddSubtaskComponent>, @Inject(MAT_DIALOG_DATA) data,private taskService: TaskService) {
    if(data.isEdit) {
      this.description = data.subtask.description;
      this.subtaskId = data.subtask._id;
      this.isEdit = data.isEdit;
    }
  }

  ngOnInit(): void {
  }

  onSubmit() {
    // this.dialogRef.close({event:'save',value:this.projectForm.value});
    let obs;
    if(this.isEdit) {
      obs= this.taskService.editSubTask({desc: this.subtaskForm.value.description,id: this.subtaskId});
    } else {
      obs = this.taskService.addSubtask(this.subtaskForm.value);
    }
    obs.subscribe(result => {
      if(result['status'] == 201) {
        this.dialogRef.close({isEdit: this.isEdit,event:'success',value:result['body']['subtask']});
      }
      if(result['status'] == 202) {
        this.dialogRef.close({isEdit: this.isEdit,event:'success',value:this.subtaskForm.value.description});
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
