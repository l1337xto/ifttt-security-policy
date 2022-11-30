import { Injectable, Inject } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { IAppConfig } from './../app-config.interface';
import { APP_CONFIG } from './../app.config';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { retry, delay } from 'rxjs/operators';
import { request } from './../models/request.model';
@Injectable({
  providedIn: 'root'
})
export class DweetServiceService {

  constructor(
    private httpClient: HttpClient,
    @Inject(APP_CONFIG) private config: IAppConfig
  ) { }

  getLatestDweet() {
    const options = {
      headers: {
        'accept': 'application/json'
      }
    };
    return this.httpClient.get(this.config._urlRetrieveDweet, options);
  }

  createDweet(payload: request) {
    const options = {
      headers: {
      }
    };
    return this.httpClient.get(this.config._urlCreateDweet + '?appliance=' + payload.appliance + '&operation=' + payload.operation);
  }

  listenForDweets() {
    const options = {
      headers: {
        'accept': 'application/json'
      }
    };
    return this.httpClient.get(this.config._urlListenForDweets, options);
  }
}
