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
import { Message } from '../_models/Message';

@Injectable()
export class UserService {

  baseUrl = environment.apiUrl;

  constructor(private authHttp: AuthHttp) { }

  getUsers(page?: number, itemsPerPage?: number, userParams?: any, likeParam?: string) {
    const paginatedResult: PaginatedResult<User[]> = new PaginatedResult<User[]>();
    let queryString = '?';

    if (page != null && itemsPerPage != null){
      queryString += 'pageNumber=' + page + '&pageSize=' + itemsPerPage + '&';
    }

    if(likeParam === 'Likers'){
      queryString += 'Likers=true&';
    }

    if(likeParam === 'Likees'){
      queryString += 'Likees=true&';
    }
    
    if (userParams != null) {
      queryString +=
      'minAge=' + userParams.minAge +
      '&maxAge=' + userParams.maxAge +
      '&gender=' + userParams.gender +
      '&orderBy=' + userParams.orderBy;
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

  sendLike(userId: number, recipientId: number){
    return this.authHttp.post(this.baseUrl + 'users/' + userId + '/like/' + recipientId, {}).catch(this.handlerError);
  }

  getMessages(id: number, page?: number, itemsPerPage?: number, messageContainer?: string){
    const paginatedResult: PaginatedResult<Message[]> = new PaginatedResult<Message[]>();
    let queryString = '?MessageContainer=' + messageContainer;

    if(page != null && itemsPerPage != null){
      queryString += '&pageNumber=' + page + '&pageSize=' + itemsPerPage;
    }

    return this.authHttp.get(this.baseUrl + 'users/' + id + '/messages' + queryString)
      .map((response: Response) => {
        paginatedResult.result = response.json();

        if(response.headers.get('Pagination') != null){
          paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
        }
        return paginatedResult;
      }).catch(this.handlerError);
  }

  getMessageThread(id: number, recipientId: number){
    return this.authHttp.get(this.baseUrl + 'users/' + id + '/messages/thread/' + recipientId).map((response: Response) => {
      return response.json();
    }).catch(this.handlerError);
  }

  sendMessage(id: number, message: Message){
    return this.authHttp.post(this.baseUrl + 'users/' + id + '/messages', message).map((response: Response) => {
      return response.json();
    })
  }

  deleteMessage(id: number, userId: number){
    return this.authHttp.post(this.baseUrl + 'users/' + userId + '/messages/' + id, {}).map(response => {}).catch(this.handlerError);
  }

  markAsRead(userId: number, messageId: number){
    return this.authHttp.post(this.baseUrl + 'users/' + userId + '/messages/' + messageId + '/read', {}).subscribe();
  }
  

  private handlerError(error: any) {

    if(error.status == 400){
      return Observable.throw(error._body);
    }
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
