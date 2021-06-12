import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { environment } from "src/environments/environment";

const BACKEND_URL = environment.apiUrl + "/api/tasks";

@Injectable()
export class TaskService {

    constructor(private http: HttpClient, private route: ActivatedRoute) {}

    getBacklogs() {
    let projectId = '';
    let versionId = '';
    let sprintId = '';

    this.route.queryParams.subscribe(result => {
      projectId = result['projectId'];
      versionId = result['versionId'];
      sprintId = result['sprintId'];
    });
      return this.http.get(BACKEND_URL+'/getTasks',
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
    return this.http.post(BACKEND_URL+'/add-task', backlogData,
    {
      params: new HttpParams().set('projectId', projectId).set('versionId',versionId).set('sprintId',sprintId),
      observe: 'response'
    }
  );
  }

  editBacklog(backlogData) {
    let projectId = '';
    let versionId = '';
    let sprintId = '';

    this.route.queryParams.subscribe(result => {
      projectId = result['projectId'];
      versionId = result['versionId'];
      sprintId = result['sprintId'];
    });
    return this.http.put(BACKEND_URL+'/edit-task', backlogData,
    {
      params: new HttpParams().set('projectId', projectId).set('versionId',versionId).set('sprintId',sprintId),
      observe: 'response'
    }
  );
  }

  getDevelopers() {
    let projectId = '';

    this.route.queryParams.subscribe(result => {
      projectId = result['projectId'];
    });
      return this.http.get(BACKEND_URL+'/getDevelopers',
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
        projectId = result['projectId'];
        versionId = result['versionId'];
        sprintId = result['sprintId'];
        taskId = result['taskId'];
      });
        return this.http.get(BACKEND_URL+'/getSubtasks',
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
          projectId = result['projectId'];
          versionId = result['versionId'];
          sprintId = result['sprintId'];
          taskId = result['taskId'];
        });
        return this.http.post(BACKEND_URL+'/add-subtask', subtaskData,
        {
          params: new HttpParams().set('projectId', projectId).set('versionId',versionId).set('sprintId',sprintId)
          .set('taskId',taskId),
          observe: 'response'
        }
      );
      }

      editSubTask(subtask) {
        return this.http.put(BACKEND_URL+'/edit-subtask', subtask,
        {
          observe: 'response'
        }
      );
      }

      removeSubtask(subtask) {
        let taskId = '';
        let sprintId = '';
        this.route.queryParams.subscribe(result => {
          taskId = result['taskId'];
          sprintId = result['sprintId'];
        });
        return this.http.put(BACKEND_URL+'/remove-subtask', subtask,
        {
          params: new HttpParams().set('taskId', taskId).set('sprintId', sprintId),
          observe: 'response'
        }
      );
      }

      onSubtaskCompletion(subtask) {
        let taskId = '';
        let sprintId = '';
        this.route.queryParams.subscribe(result => {
          taskId = result['taskId'];
          sprintId = result['sprintId'];
        });
        return this.http.post(BACKEND_URL+'/complete-subtask', subtask,
        {
          params: new HttpParams().set('taskId', taskId).set('sprintId', sprintId),
          observe: 'response'
        }
      );
      }

      removeBacklog(task) {
        let sprintId = '';
        this.route.queryParams.subscribe(result => {
          sprintId = result['sprintId'];
        });
        return this.http.put(BACKEND_URL+'/remove-task', task,
        {
          params: new HttpParams().set('sprintId', sprintId),
          observe: 'response'
        }
      );
      }
}


