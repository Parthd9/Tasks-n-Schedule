import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormGroup, NgForm } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProjectsService } from '../../projects.service';

@Component({
  selector: 'app-add-project-dialog',
  templateUrl: './add-project-dialog.component.html',
  styleUrls: ['./add-project-dialog.component.css']
})
export class AddProjectDialogComponent implements OnInit {

  @ViewChild('addProjectForm',{static: true}) projectForm: NgForm;
  header:string;
  name:string;
  description: string
  maxChars = 200;
  devOptEnabled;
  showMsg = false;
  filterDevs = '';
  developersList = [];
  filteredList = [];

  constructor(private dialogRef: MatDialogRef<AddProjectDialogComponent>,  @Inject(MAT_DIALOG_DATA) data, private projectService: ProjectsService) {
    this.header = data.header;
    this.name = data.name;
    this.description = data.description;
    this.devOptEnabled = data.devoptEnabled;
    this.developersList = data.developers;

    this.developersList = this.developersList.map((developer) => {
      let name = developer.firstName +' '+ developer.lastName;
      return {name:name, email: developer.email, role: developer.role}
    })
    console.log('devlist:',this.developersList);
    this.filteredList = [...this.developersList];
    console.log(this.devOptEnabled);
  }

  ngOnInit(): void {
  }

  onSubmit() {
    // this.dialogRef.close({event:'save',value:this.projectForm.value});
    this.projectService.addProject(this.projectForm.value).subscribe(result => {
      if(result['status'] == 201) {
        console.log('success');
        console.log(result['body']['data']);
        this.dialogRef.close({event:'success',value:result['body']['data']});
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
