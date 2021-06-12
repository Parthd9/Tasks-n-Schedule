import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

const BACKEND_URL = environment.apiUrl + "/api/admin";

@Injectable()
export class AdminService {

  constructor(private http: HttpClient) {}
  addUser(data) {
    return this.http.post(BACKEND_URL+'/add-user', data,  {observe: 'response'});
  }
  getUsers() {
    return this.http.get(BACKEND_URL+'/get-users', {observe: 'response'});
  }
  editUser(data) {
    // console.log(data);
    return this.http.put(BACKEND_URL+'/edit-user', data,  {observe: 'response'});
  }
  removeUser(id) {
    return this.http.post(BACKEND_URL+'/remove-user', id, {observe: 'response'});
  }

  getProjectsData() {
    return this.http.get(BACKEND_URL+'/getProjectsData', {observe: 'response'});
  }
  getAllUsersCount() {
    return this.http.get(BACKEND_URL+'/getAllusersCount', {observe: 'response'});
  }
  getTechDataCount() {
    return this.http.get(BACKEND_URL+'/getTechDataCount', {observe: 'response'});
  }
  getYearWiseCount() {
    return this.http.get(BACKEND_URL+'/getYearWiseCount', {observe: 'response'});
  }


}
