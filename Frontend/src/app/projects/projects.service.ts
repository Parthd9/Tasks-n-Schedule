import { HttpClient, HttpParams, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { environment } from "src/environments/environment";

const BACKEND_URL = environment.apiUrl + "/api/projects";

@Injectable()
export class ProjectsService {
    constructor(private http: HttpClient, private route: ActivatedRoute) {}

    addProject(data) {
        return this.http.post(BACKEND_URL+'/add-project',data, { observe: 'response'});
    }

    getDevelopers() {
        return this.http.get(BACKEND_URL+'/getDevelopers');
    }

    getProjects() {
        return this.http.get(BACKEND_URL+'/getProjects');
    }

    getVersions() {
      let projectId = '';
      this.route.queryParams.subscribe(result => {
        projectId = result['projectId'];
      });
        return this.http.get(BACKEND_URL+'/getVersions',
        {
          params: new HttpParams().set('projectId', projectId),
          observe: 'response'
        }
      );
    }

    addVersion(versionData) {
      let projectId = '';
      this.route.queryParams.subscribe(result => {
        projectId = result['projectId'];
      });
      return this.http.post(BACKEND_URL+'/add-version', versionData,
      {
        params: new HttpParams().set('projectId', projectId),
        observe: 'response'
      }
    );
  }

  getSprints() {
    let projectId = '';
    let versionId = '';
    this.route.queryParams.subscribe(result => {
      projectId = result['projectId'];
      versionId = result['versionId'];
    });
      return this.http.get(BACKEND_URL+'/getSprints',
      {
        params: new HttpParams().set('projectId', projectId).set('versionId',versionId),
        observe: 'response'
      }
    );
  }

  addSprint(sprintData) {
    let projectId = '';
    let versionId = '';
    this.route.queryParams.subscribe(result => {
      projectId = result['projectId'];
      versionId = result['versionId'];
    });
    return this.http.post(BACKEND_URL+'/add-sprint', sprintData,
    {
      params: new HttpParams().set('projectId', projectId).set('versionId',versionId),
      observe: 'response'
    }
  );
}

editSprint(sprintData) {
  let projectId = '';
  let versionId = '';
  this.route.queryParams.subscribe(result => {
    projectId = result['projectId'];
    versionId = result['versionId'];
  });
  return this.http.put(BACKEND_URL+'/edit-sprint', sprintData,
  {
    params: new HttpParams().set('projectId', projectId).set('versionId',versionId),
    observe: 'response'
  }
);
}

editVersion(versionData) {
  let projectId = '';
  this.route.queryParams.subscribe(result => {
    // console.log('result query:',result);
    projectId = result['projectId'];
  });
  return this.http.put(BACKEND_URL+'/edit-version', versionData,
  {
    params: new HttpParams().set('projectId', projectId),
    observe: 'response'
  }
);
}

editProject(projectData) {
  return this.http.put(BACKEND_URL+'/edit-project', projectData,{observe: 'response'});
}

getMailList() {
  let projectId = '';
  this.route.queryParams.subscribe(result => {
    projectId = result['projectId'];
  });
  return this.http.get(BACKEND_URL+'/getMailList',
  {
    params: new HttpParams().set('projectId', projectId),
    observe: 'response',
  });
}

sendReportMail(sprintId, list) {
  let projectId = '';
  let versionId = '';
  this.route.queryParams.subscribe(result => {
    console.log('result query:',result);
    projectId = result['projectId'];
    versionId = result['versionId'];
  });
  return this.http.post(BACKEND_URL+'/sendReport',{list:list},
  {
    params: new HttpParams().set('projectId', projectId).set('versionId',versionId).set('sprintId',sprintId),
    observe: 'response',
  });
}

}
