import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProjectsService } from '../../projects.service';

@Component({
  selector: 'app-add-project-dialog',
  templateUrl: './add-project-dialog.component.html',
  styleUrls: ['./add-project-dialog.component.css']
})
export class AddProjectDialogComponent implements OnInit {

  // @ViewChild('addProjectForm',{static: true}) projectForm: NgForm;
  addProjectForm: FormGroup;
  header='';
  name = '';
  description = '';
  maxChars = 200;
  showMsg = false;
  filterDevs = '';
  developersList = [];
  filteredList = [];
  devlist=[];
  techlist = [];
  projectData;
  isEdit;
  technologies = ['Java','JavaScript','TypeScript','Python','Ruby','Golang','C','C++','Kotlin','Php','.Net'];

  constructor(private dialogRef: MatDialogRef<AddProjectDialogComponent>,  @Inject(MAT_DIALOG_DATA) data, private projectService: ProjectsService) {
    
    console.log('data:',data);

    this.addProjectForm = new FormGroup({
      'title': new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(28)]),
      'description': new FormControl('', [Validators.required, Validators.minLength(20), Validators.maxLength(200)]),
      'list': new FormControl('', [Validators.required, Validators.minLength(3)]),
      'technologies': new FormControl('', Validators.required)
    });
    this.header = data.header;
    this.isEdit = data.isEdit;
    this.developersList = data.developers;
    this.developersList = this.developersList.map((developer) => {
      let name = developer.firstName +' '+ developer.lastName;
      return {name:name, email: developer.email, role: developer.role}
    })
    console.log('devlist:',this.developersList);
    this.filteredList = [...this.developersList];
  
    if(this.isEdit) {
    this.projectData = data.projectData;
    } 
  }

  ngOnInit(): void {
    if(this.projectData) {
      this.devlist = this.projectData['team'];
      this.filteredList = [...this.devlist];
      const arr3 = [].concat(
        this.developersList.filter(obj1 => this.devlist.every(obj2 => obj1.email !== obj2.email))
        // this.devlist.filter(obj2 => this.developersList.every(obj1 => obj2.email !== obj1.email))
    );
    console.log(arr3);
    this.filteredList = [...this.filteredList, ...arr3];
    this.addProjectForm.patchValue({
      title: this.projectData['name'],
      description: this.projectData['description'],
      list: this.devlist,
      technologies: this.projectData['technologies']
    });
    }
  }

  onSubmit() {
    // this.dialogRef.close({event:'save',value:this.projectForm.value});
    console.log(this.addProjectForm.value);
    console.log(this.addProjectForm.get('title').value);
    let obs;
    let projectDoc;
    if(!this.isEdit) {
      obs = this.projectService.addProject(this.addProjectForm.value);
    } else {
      obs = this.projectService.editProject({...this.addProjectForm.value, id: this.projectData['_id']})
    }
    obs.subscribe(result => {
      if(result['status'] == 201 || result['status'] == '202') {
        console.log('success');
        console.log(result['body']['data']);
        if(!this.isEdit) {
        this.dialogRef.close({event:'success',value:result['body']['data']});
        } else {
          projectDoc = {name: this.addProjectForm.get('title').value, description: this.addProjectForm.get('description').value, 
          team: this.addProjectForm.get('list').value, technologies:this.addProjectForm.get('technologies').value,
          _id: this.projectData['_id']};
          this.dialogRef.close({event:'success',value: projectDoc});
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
