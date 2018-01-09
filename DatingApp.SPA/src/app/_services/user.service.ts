import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs/Observable';
import { User } from '../_models/User';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

import { AuthHttp } from 'angular2-jwt';

@Injectable()
export class UserService {

    baseUrl = environment.apiUrl;

    constructor(private authHttp: AuthHttp) {}

    getUsers(): Observable<User[]> {
        return this.authHttp
          .get(this.baseUrl + 'users')
          .map(response => <User[]>response.json())
          .catch(this.handlerError);
    }

    getUser(id): Observable<User> {
      return this.authHttp
        .get(this.baseUrl + 'users/' + id)
        .map(response => <User>response.json())
        .catch(this.handlerError);
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