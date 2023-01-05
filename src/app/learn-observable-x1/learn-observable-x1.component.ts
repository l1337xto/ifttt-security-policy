import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-learn-observable-x1',
  templateUrl: './learn-observable-x1.component.html',
  styleUrls: ['./learn-observable-x1.component.css']
})
export class LearnObservableX1Component implements OnInit {

  constructor() { }
  displayArray: string[] = [];
  ngOnInit(): void {
    const observable$ = new Observable<string>(subscriber => {
      console.log('Observable created')
      subscriber.next('Hello');
      setTimeout(() => {
        subscriber.next('World');
        subscriber.complete();
      }, 1000);
    })
    observable$.subscribe((value) => {
      this.displayArray.push(value);
    });
  }

}
