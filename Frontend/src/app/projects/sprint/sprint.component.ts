import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { ShowMessageComponent } from 'src/app/shared/show-message/show-message.component';
import { AddVersionComponent } from '../modals/add-version/add-version.component';
import { EmailComponent } from '../modals/email/email.component';
import { ProjectsService } from '../projects.service';

@Component({
  selector: 'app-sprint',
  templateUrl: './sprint.component.html',
  styleUrls: ['./sprint.component.css']
})
export class SprintComponent implements OnInit {

  userRole = '';
  sprints = [];
  mailList = [];
  durationInSeconds = 4;

  constructor(private dialog: MatDialog, private currentRoute: ActivatedRoute, private router: Router,
    private authService: AuthService, private projectService: ProjectsService, private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.authService.user.subscribe(user => {
      this.userRole = user['role'];
    });
    this.projectService.getSprints().subscribe(sprintDoc => {
      if(sprintDoc['status'] === 200) {
        this.sprints = sprintDoc['body']['sprints'];
        this.sprints = this.sprints.map(sprint => {
          let showMail;
          if(new Date(sprint['completionDate'])< new Date()) {
            showMail = true;
          } else {
            showMail = false;
          }
          return {...sprint, showMail: showMail};
        })
      }
    });
    this.projectService.getMailList().subscribe(data => {
      if(data['status'] === 200) {
        this.mailList = data['body']['list'];
      }
    });
  }

  openDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      id: 1,
      header: 'Add New Sprint',
      name: 'Sprint Number',
      description: 'Sprint Description',
      fromVersion: false
    };
    dialogConfig.width = '30%';
    dialogConfig.minWidth = '300px';
    const dialogRef = this.dialog.open(AddVersionComponent,dialogConfig);

    dialogRef.afterClosed().subscribe(data => {
      if(data.event === 'success') {
        this.sprints.push(data.value);
        this._snackBar.openFromComponent(ShowMessageComponent, {
          duration: this.durationInSeconds * 1000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['success'],
          data: {type: 'success', msg: 'Sprint added successfully.'}
        });
      }
    });
  }

  onViewBacklog(id) {
    this.router.navigate(['backlog'],{relativeTo:this.currentRoute, queryParams: {sprintId: id}, queryParamsHandling: "merge"});
  }

  openMail(item) {
    if(!item.showMail) {
      return;
    }
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.width = '30%';
    dialogConfig.minWidth = '300px';
    dialogConfig.disableClose = true;
    dialogConfig.data = {'list':this.mailList, id: item._id};
    const dialogRef = this.dialog.open(EmailComponent,dialogConfig);

    dialogRef.afterClosed().subscribe(data => {
      // console.log('Dialog result:', data);
      if(data.event === 'save') {
        this._snackBar.openFromComponent(ShowMessageComponent, {
          duration: this.durationInSeconds * 1000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['success'],
          data: {type: 'success', msg: 'Report mail sent successfully.'}
        });
      }
    });
  }

  onEditSprint(item) {
    const dialogRef = this.dialog.open(AddVersionComponent, {
      width: '40%',
      minWidth: '300px',
      data: { isEdit: true,fromVersion: false,details: item, header: 'Edit Sprint'}
    });
    dialogRef.afterClosed().subscribe(data => {
      if(data.event === 'success') {
        const index = this.sprints.findIndex(s=> {
          return s._id === item._id;
        })
        this.sprints[index] = data.value;
        this._snackBar.openFromComponent(ShowMessageComponent, {
          duration: this.durationInSeconds * 1000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['success'],
          data: {type: 'success', msg: 'Sprint updated successfully.'}
        });
      }
    });
  }

}
