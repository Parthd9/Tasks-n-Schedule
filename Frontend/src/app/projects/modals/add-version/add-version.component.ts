import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProjectsService } from '../../projects.service';

@Component({
  selector: 'app-add-version',
  templateUrl: './add-version.component.html',
  styleUrls: ['./add-version.component.css']
})
export class AddVersionComponent implements OnInit {

  @ViewChild('addVersionForm',{static: true}) versionForm: NgForm;
  header:string;
  name:string;
  description: string
  fromVersion: boolean;
  maxChars = 200;
  showMsg = false;
  selectedDate;
  maxDate;
  minDate;
  isEdit;
  sname=''; 
  sdesc = '';
  selDate = null;

  preservedData;
  constructor(private dialogRef: MatDialogRef<AddVersionComponent>,  @Inject(MAT_DIALOG_DATA) data, private projectService: ProjectsService) {
    this.header = data.header;
    this.name = data.name;
    this.description = data.description;
    this.fromVersion = data.fromVersion;
    this.isEdit = data.isEdit;
    this.preservedData = data['details'];
  }


  ngOnInit(): void {
    this.maxDate = new Date();
    this.maxDate.setDate(this.maxDate.getDate() + 28);

    this.minDate = new Date();
    this.minDate.setDate(this.minDate.getDate() + 14);

    if(this.preservedData) {
      console.log('desc:',this.preservedData['description']);
      this.sname = this.preservedData['name'];
      this.sdesc = this.preservedData['description'];
      if(!this.fromVersion) {
      this.selDate = this.preservedData['completionDate'];
      }
    }
  }


  onSubmit() {
    let obsData;
    let doc;
    if(this.fromVersion && !this.isEdit) {
      obsData = this.projectService.addVersion(this.versionForm.value);
    } 
    if(!this.fromVersion && !this.isEdit) {
      obsData = this.projectService.addSprint(this.versionForm.value);
    } 
    if(this.fromVersion && this.isEdit) {
      // edit version...
      obsData = this.projectService.editVersion({...this.versionForm.value, id: this.preservedData['_id']});
      doc = {...this.versionForm.value, id: this.preservedData['_id']};
    }
    if(!this.fromVersion && this.isEdit) {
      obsData = this.projectService.editSprint({...this.versionForm.value, id: this.preservedData['_id']});
      doc = {...this.versionForm.value, id: this.preservedData['_id']};
    }
    obsData.subscribe(result => {
      if(result['status'] == 201 || result['status'] == 202) {
        console.log('success');
        console.log(result['body']['data']);
        if(this.isEdit) {
          doc = { name:this.versionForm.value.title , description: this.versionForm.value.desc, completionDate: this.versionForm.value.selectedDate, _id: this.preservedData['_id']}
          this.dialogRef.close({event:'success',value:doc});
        } else {
          this.dialogRef.close({event:'success',value:result['body']['data']});
        }
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
