import { InjectionToken } from '@angular/core';
import { environment } from '../environments/environment';
import { IAppConfig } from './app-config.interface';

export let APP_CONFIG = new InjectionToken<IAppConfig>('app.config');

const host = environment.dweethost;
const protocol = environment.protocol;

export const APP_URL_CONFIG: IAppConfig = {
    _urlRetrieveDweet: protocol + host + '/get/latest/dweet/for/bouncy-hands',
    _urlCreateDweet: protocol + host + '/dweet/for/bouncy-hands',
    _urlLastFiveDweets: protocol + host + '/get/dweets/for/bouncy-hands',
    _urlListenForDweets: protocol + host + '/listen/for/dweets/from/bouncy-hands'
}
