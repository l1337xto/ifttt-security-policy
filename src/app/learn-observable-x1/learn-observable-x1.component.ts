import { Component, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { ajax } from "rxjs/ajax";
import { User } from './interface/IUser';
@Component({
  selector: 'app-learn-observable-x1',
  templateUrl: './learn-observable-x1.component.html',
  styleUrls: ['./learn-observable-x1.component.css']
})
export class LearnObservableX1Component implements OnInit {

  constructor() { }
  displayArray: string[] = [];
  userArray: User[] = [];
  displayUser:boolean[] = [];
  ngOnInit(): void {
    // this.observableLifeCycle();
    // this.displayContentAndCompleteObservable();
    // this.intervalEmissionsAndUnsubscribe();
    this.randomData();

  }
  randomData(): void {
    const users$ = ajax('https://random-data-api.com/api/v2/users');
    users$.subscribe((response: any) => {
      if (response && response.response) {
        const user: User = response.response;
        if(user){
          this.displayUser.push(false);
          this.userArray.push(user);
        }
      }
    })
  }
  intervalEmissionsAndUnsubscribe() {
    const interval$ = new Observable<string>(subscriber => {
      this.displayArray.push(`Subscription successful at ${new Date().toJSON()}`)
      let counter: number = 1;
      const intervalId = setInterval(() => {
        subscriber.next(`${counter++}`)
      }, 2000)
      return (() => {
        this.displayArray.push(`Subscription Teardown at ${new Date().toJSON()}`);
        clearInterval(intervalId);
      })

    })

    const interval: Subscription = interval$.subscribe({
      next: value => this.displayArray.push(value),
      error: () => this.displayArray.push(`Error Encountered. Stream was Ended ${new Date().toJSON()}`),
      complete: () => this.displayArray.push(`Observable Stream Completed ${new Date().toJSON()}`)
    });
    setTimeout(() => interval.unsubscribe(), 14e3);
  }
  displayContentAndCompleteObservable(): void {
    const observable$ = new Observable<string>(subscriber => {
      subscriber.next('Hello');
      setTimeout(() => {
        subscriber.next('World');
        // subscriber.error();
        setTimeout(() => subscriber.complete(), 2000);
      }, 1000);
      return (() => this.displayArray.push(`Teardown  ${new Date()}`))
    })
    observable$.subscribe({
      next: value => this.displayArray.push(`value ${new Date()}`),
      complete: () => this.displayArray.push(`Observable Stream Completed ${new Date()}`),
      error: () => this.displayArray.push(`Error Encountered. Stream was Ended ${new Date()}`)
    });
  }
  observableLifeCycle(): void {
    const observable$ = new Observable(subscribe => {
      console.log("Observable Created")
    });
    console.log("Before Observable subscribed");
    observable$.subscribe();
    console.log("After Observable subscribed");

    // console.log("Observable unsubscribed");
  }
  /**
   * User Functions
   */
  hideSSN(social_insurance_number: string) {
    if (social_insurance_number && social_insurance_number.trim().length === 9) {
      return social_insurance_number.substring(5);
    }
    return 'ERR'
  }
  hideCard(cc_no:string):string{
    if(cc_no && cc_no.trim().length === 19){
      return cc_no.substring(14);
    }
    return 'ERR';
  }
  toggleUser(index:number):number{
    this.displayUser[index]=!this.displayUser[index];
    return -1;
  }
  scrollTop():void{
    window.scroll(0,0)
  }
  closeAll():void{
    this.displayUser.forEach((_user, index, self) => {self[index] = false});
  }
}
