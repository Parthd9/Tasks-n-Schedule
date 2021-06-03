import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { ShowMessageComponent } from 'src/app/shared/show-message/show-message.component';
import { AddProjectDialogComponent } from '../modals/add-project-dialog/add-project-dialog.component';
import { AddVersionComponent } from '../modals/add-version/add-version.component';
import { EmailComponent } from '../modals/email/email.component';
import { ProjectsService } from '../projects.service';

@Component({
  selector: 'app-version',
  templateUrl: './version.component.html',
  styleUrls: ['./version.component.css']
})
export class VersionComponent implements OnInit {

  userRole = '';
  versions = [];
  durationInSeconds=4;

  constructor(private dialog: MatDialog,private router: Router, private route: ActivatedRoute, private authService: AuthService,
              private projectService: ProjectsService, private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    console.log(this.route.snapshot.queryParams['projectId']);
    this.authService.user.subscribe(user => {
      this.userRole = user['role'];
    });
    this.projectService.getVersions().subscribe(versionDoc => {
      if(versionDoc['status'] === 200) {
        this.versions = versionDoc['body']['versions'];
      }
    });
  }

  openDialog() {
    const dialogConfig = new MatDialogConfig();
    // dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      id: 1,
      header: 'Add New Version',
      name: 'Version Name',
      description: 'Version Description',
      fromVersion: true
    };
    dialogConfig.width = '30%';
    dialogConfig.minWidth = '300px';
    const dialogRef = this.dialog.open(AddVersionComponent,dialogConfig);

    dialogRef.afterClosed().subscribe(data => {
      console.log('Dialog result:', data);
      if(data.event === 'success') {
        this.versions.push(data.value);
        this._snackBar.openFromComponent(ShowMessageComponent, {
          duration: this.durationInSeconds * 1000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['success'],
          data: {type: 'success', msg: 'Version added successfully.'}
        });
      }
    });
  }

  openMail() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.width = '30%';
    dialogConfig.minWidth = '300px';
    const dialogRef = this.dialog.open(EmailComponent,dialogConfig);

    dialogRef.afterClosed().subscribe(data => {
      console.log('Dialog result:', data);
      if(data.event === 'save') {
        console.log('data email:',data);
      }
    });
  }
  onViewSprint(id) {
    this.router.navigate(['sprint'],{relativeTo:this.route, queryParams: {versionId: id}, queryParamsHandling: "merge"});
  }

}
