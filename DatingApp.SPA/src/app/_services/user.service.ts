import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs/Observable';
import { User } from '../_models/User';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

@Injectable()
export class UserService {

    baseUrl = environment.apiUrl;

    constructor(private http: Http) {}

    getUsers(): Observable<User[]> {
        return this.http.get(this.baseUrl + 'users', this.jwt())
            .map(response => <User[]>response.json())
            .catch(this.handlerError);
    }

    private jwt() {
        let token = localStorage.getItem('token');

        if (token) {
            let headers = new Headers({'Authorization': 'Bearer ' + token});
            headers.append('Content-type', 'application/json');
            return new RequestOptions({headers: headers});
        }
    }

    private handlerError(error: any) {
        const applicationError = error.headers.get('Application-Error');
    
        if (applicationError) {
          return Observable.throw(applicationError);
        }
    
        const serverError = error.json();
        let modelStateErros = '';
    
        if (serverError) {
          for (const key in serverError) {
            if (serverError[key]) {
              modelStateErros += serverError[key] + '\n';
            }
          }
        }
        return Observable.throw(modelStateErros || 'Server error');
      }
}