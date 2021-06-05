import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

@Injectable()
export class TaskService {

    constructor(private http: HttpClient, private route: ActivatedRoute) {}

    getBacklogs() {
    let projectId = '';
    let versionId = '';
    let sprintId = '';

    this.route.queryParams.subscribe(result => {
      console.log('result query:',result);
      projectId = result['projectId'];
      versionId = result['versionId'];
      sprintId = result['sprintId'];
    });
      return this.http.get('/tns/api/tasks/getBacklogs',
      {
        params: new HttpParams().set('projectId', projectId).set('versionId',versionId).set('sprintId',sprintId),
        observe: 'response'
      }
    );
    }

    addBacklog(backlogData) {
    let projectId = '';
    let versionId = '';
    let sprintId = '';

    this.route.queryParams.subscribe(result => {
      console.log('result query:',result);
      projectId = result['projectId'];
      versionId = result['versionId'];
      sprintId = result['sprintId'];
    });
    return this.http.post('/tns/api/tasks/add-backlog', backlogData,
    {
      params: new HttpParams().set('projectId', projectId).set('versionId',versionId).set('sprintId',sprintId),
      observe: 'response'
    }
  );
  }

  getDevelopers() {
    let projectId = '';

    this.route.queryParams.subscribe(result => {
      console.log('result query:',result);
      projectId = result['projectId'];
    });
      return this.http.get('/tns/api/tasks/getDevelopers',
      {
        params: new HttpParams().set('projectId', projectId),
        observe: 'response'
      }
    );
    }

    getSubtasks() {
      let projectId = '';
      let versionId = '';
      let sprintId = '';
      let taskId = '';
  
      this.route.queryParams.subscribe(result => {
        console.log('result query:',result);
        projectId = result['projectId'];
        versionId = result['versionId'];
        sprintId = result['sprintId'];
        taskId = result['taskId'];
      });
        return this.http.get('/tns/api/tasks/getSubtasks',
        {
          params: new HttpParams().set('projectId', projectId).set('versionId',versionId).set('sprintId',sprintId)
          .set('taskId',taskId),
          observe: 'response'
        }
      );
      }

      addSubtask(subtaskData) {
        let projectId = '';
        let versionId = '';
        let sprintId = '';
        let taskId = '';
    
        this.route.queryParams.subscribe(result => {
          console.log('result query:',result);
          projectId = result['projectId'];
          versionId = result['versionId'];
          sprintId = result['sprintId'];
          taskId = result['taskId'];
        });
        return this.http.post('/tns/api/tasks/add-subtask', subtaskData,
        {
          params: new HttpParams().set('projectId', projectId).set('versionId',versionId).set('sprintId',sprintId)
          .set('taskId',taskId),
          observe: 'response'
        }
      );
      }
}


