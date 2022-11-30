import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { APP_CONFIG, APP_URL_CONFIG } from './app.config';
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
  ],
  providers: [
    { provide: APP_CONFIG, useValue: APP_URL_CONFIG },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
