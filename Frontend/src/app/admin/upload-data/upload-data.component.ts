import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FileSystemDirectoryEntry, FileSystemFileEntry, NgxFileDropEntry } from 'ngx-file-drop';

@Component({
  selector: 'app-upload-data',
  templateUrl: './upload-data.component.html',
  styleUrls: ['./upload-data.component.css']
})
export class UploadDataComponent implements OnInit {

  public file:File;
  disable = false;

  constructor(private http: HttpClient, public dialogRef: MatDialogRef<UploadDataComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
  }

  public dropped(files: NgxFileDropEntry[]) {
    // this.file = files[0];
    console.log('files:',files);

      // Is it a file?
      if (files[0].fileEntry.isFile) {
        const fileEntry = files[0].fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {

          // Here you can access the real file
          console.log(files[0].relativePath, file);
          this.file = file;
          console.log(this.file);
          console.log('file type:',file.type);
          if(file.type !== 'application/vnd.ms-excel') {
            console.log('Invalid file format');
          } else {
            this.disable = true;
          }
          /**
          // You could upload it like this:


          // Headers
          const headers = new HttpHeaders({
            'security-token': 'mytoken'
          })


          **/
        });
      } else {
        // It was a directory (empty directories are added, otherwise only files)
        const fileEntry = files[0].fileEntry as FileSystemDirectoryEntry;
        console.log(files[0].relativePath, fileEntry);
      }
  }

  onFileRemove() {
    this.disable = false;
    this.file = null;
  }

  onFileUpload() {
    const formData = new FormData()
    formData.append('file', this.file)

    // this.http.post('tns/auth/register-users', formData,{ responseType: 'blob' })
    // .subscribe(data => {
    //   console.log(data);
    // })
  }

  onCancel() {
    this.dialogRef.close({event:'cancel'});
  }
}
