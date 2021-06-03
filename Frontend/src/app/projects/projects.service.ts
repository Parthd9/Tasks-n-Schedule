import { HttpClient, HttpParams, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

@Injectable()
export class ProjectsService {
    constructor(private http: HttpClient, private route: ActivatedRoute) {}

    addProject(data) {
        console.log('project data:',data);
        return this.http.post('/tns/api/projects/add-project',data, { observe: 'response'});
    }

    getDevelopers() {
        return this.http.get('/tns/api/projects/getDevelopers');
    }

    getProjects() {
        return this.http.get('/tns/api/projects/getProjects');
    }

    getVersions() {

      let projectId = '';
      this.route.queryParams.subscribe(result => {
        console.log('result query:',result);
        projectId = result['projectId'];
      });
        return this.http.get('/tns/api/projects/getVersions',
        {
          params: new HttpParams().set('projectId', projectId),
          observe: 'response'
        }
      );
    }

    addVersion(versionData) {
      let projectId = '';
      this.route.queryParams.subscribe(result => {
        console.log('result query:',result);
        projectId = result['projectId'];
      });
      return this.http.post('/tns/api/projects/add-version', versionData,
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
      console.log('result query:',result);
      projectId = result['projectId'];
      versionId = result['versionId'];
    });
      return this.http.get('/tns/api/projects/getSprints',
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
      console.log('result query:',result);
      projectId = result['projectId'];
      versionId = result['versionId'];
    });
    return this.http.post('/tns/api/projects/add-sprint', sprintData,
    {
      params: new HttpParams().set('projectId', projectId).set('versionId',versionId),
      observe: 'response'
    }
  );
}
}
