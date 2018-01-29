import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs/Observable';
import { User } from '../_models/User';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

import { AuthHttp } from 'angular2-jwt';
import { PaginatedResult } from '../_models/pagination';

@Injectable()
export class UserService {

  baseUrl = environment.apiUrl;

  constructor(private authHttp: AuthHttp) { }

  getUsers(page?: number, itemsPerPage?: number, userParams?: any) {
    const paginatedResult: PaginatedResult<User[]> = new PaginatedResult<User[]>();
    let queryString = '?';

    if (page != null && itemsPerPage != null){
      queryString += 'pageNumber=' + page + '&pageSize=' + itemsPerPage + '&';
    }

    if (userParams != null) {
      queryString +=
      'minAge=' + userParams.minAge +
      '&maxAge' + userParams.maxAge +
      '&gender' + userParams.gender;
    }

    return this.authHttp
      .get(this.baseUrl + 'users' + queryString)
      .map((response: Response) => {
        paginatedResult.result = response.json();

        if (response.headers.get('Pagination') != null){
          paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
        }

        return paginatedResult;
      })
      .catch(this.handlerError);
  }

  getUser(id): Observable<User> {
    return this.authHttp
      .get(this.baseUrl + 'users/' + id)
      .map(response => <User>response.json())
      .catch(this.handlerError);
  }

  updateUser(id: number, user: User) {
    return this.authHttp.put(this.baseUrl + 'users/' + id, user).catch(this.handlerError);
  }

  setMainPhoto(userId: number, id: number) {
    return this.authHttp.post(this.baseUrl + 'users/' + userId + '/photos/' + id + '/setMain', {})
      .catch(this.handlerError);
  }

  deletePhoto(userId: number, id: number) {
    return this.authHttp.delete(this.baseUrl + 'users/' + userId + '/photos/' + id)
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
