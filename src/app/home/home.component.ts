import { Component, OnInit } from '@angular/core';
import { DweetServiceService } from './dweet-service.service';
import { IFTTTRequest, request } from '../models/request.model';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  content: IFTTTRequest;
  showRequest: boolean;
  requestedAppliance: string;
  requestedOperation: string;
  lastFetchTime: Date | undefined;
  readonly operations: string[] = ['on', 'off'];
  readonly imageRoot: string = './../../../assets/images/';
  readonly PNG: string = '.png';
  readonly appliances: string[] = ['air-conditioner', 'oven', 'electric-teapot', 'garage-open', 'lights', 'roomba', 'washer', 'water-heater'];
  readonly abbr: string[] = ['Air Conditioning', 'Oven', 'Teapot', 'Garage Door', 'Lights', 'Roomba Cleaner', 'Washer', 'Water Heater'];
  applianceState: string[];
  masterMessage: string[];
  readonly allowedHoursOven: number[] = [15, 16, 17, 18, 19];
  readonly allowedHoursLights: number[] = [18, 19, 20, 21];
  readonly allowedHoursGarageDoor: number[] = [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21];

  appOp: Map<string, string> = new Map<string, string>();
  constructor(
    private service: DweetServiceService,
  ) { }

  ngOnInit(): void {
    this.showRequest = false;
    this.requestedAppliance = '';
    this.requestedOperation = '';
    this.applianceState = new Array(this.appliances.length);
    this.applianceState.fill('off');
    this.masterMessage = new Array(this.appliances.length);
    this.masterMessage.fill('N/A');
    this.lastFetchTime = undefined;
    this.createAppOp();
    this.listenDweets();
  }
  createAppOp() {
    this.appliances.forEach((appliance, index) => {
      this.appOp.set(appliance, this.applianceState[index]);
    });
  }
  updateAppOp() {
    this.appOp.set(this.requestedAppliance, this.requestedOperation);
  }
  randomAppliance(): string {
    const applianceIndex: number = Math.floor(Math.random() * 10);
    if (applianceIndex < 8) {
      return this.appliances[applianceIndex];
    } else {
      return this.appliances[7];
    }
  }
  randomOperation(): string {
    const operationIndex: number = Math.floor(Math.random() * 10) % 2;
    return this.operations[operationIndex];
  }
  updateMasterMessage(index: number) {
    if (this.applianceState[index] === 'on') {
      this.masterMessage[index] = this.abbr[index] + ' was turned ON at ' + this.content.created.toLocaleTimeString() + ' on ' + this.content.created.toLocaleDateString();
    } else {
      this.masterMessage[index] = this.abbr[index] + ' was turned OFF at ' + this.content.created.toLocaleTimeString() + ' on ' + this.content.created.toLocaleDateString();;
    }
  }
  rejectedRequest(index: number) {
    if (index === 3) {
      this.masterMessage[index] = 'Garage door auto-close in 30 secs as Air Conditioning is on or not within allowed hours.';
      this.createDweet('garage-open', 'on');
      this.applianceState[3] = 'on';
      setTimeout(() => {
        this.createDweet('garage-open', 'off');
      }, 3e4)
    }
    else this.masterMessage[index] = 'Request to turn ' + this.abbr[index] + ' ' + this.requestedOperation + ' was rejected';
  }
  policyChecker(): boolean {
    let allowed: boolean = false;
    switch (this.requestedAppliance) {
      case 'air-conditioner': {
        if (this.appOp.get('garage-open') === 'on') {
          allowed = false;
        } else if (this.appOp.get('washer') === 'on' && this.appOp.get('water-heater') === 'on'
          && this.appOp.get('oven') === 'on') {
          allowed = false;
        } else {
          allowed = true;
        }
        break;
      }
      case 'oven': {
        if (this.appOp.get('electric-teapot') === 'on') {
          allowed = false;
        } else if (this.appOp.get('washer') === 'on' && this.appOp.get('water-heater') === 'on'
          && this.appOp.get('air-conditioner') === 'on') {
          allowed = false;
        } else if (this.lastFetchTime && this.lastFetchTime.getHours() in this.allowedHoursOven) {
          return true;
        } else {
          allowed = false;
        }
        break;
      }
      case 'electric-teapot': {
        if (this.appOp.get('oven') === 'on') {
          allowed = false;
        } else if (this.appOp.get('washer') === 'on' && this.appOp.get('water-heater') === 'on'
          && this.appOp.get('air-conditioner') === 'on') {
          allowed = false;
        } else {
          allowed = true;
        }
        break;
      }
      case 'garage-open': {
        if (this.lastFetchTime && this.lastFetchTime.getHours() in this.allowedHoursGarageDoor) {
          if (this.appOp.get('air-conditioner') === 'on') {
            allowed = false;
          } else {
            allowed = true;
          }
        }
        break;
      }
      case 'lights': {
        if (this.lastFetchTime && this.lastFetchTime.getHours() in this.allowedHoursLights) {
          allowed = true;
        }
        break;
      }
      case 'roomba': {
        break;
      }
      case 'washer': {
        if (this.appOp.get('oven') === 'on' && this.appOp.get('water-heater') === 'on'
          && this.appOp.get('air-conditioner') === 'on') {
          allowed = false;
        } else {
          allowed = true;
        }
        break;
      }
      case 'water-heater': {
        if (this.appOp.get('washer') === 'on' && this.appOp.get('oven') === 'on'
          && this.appOp.get('air-conditioner') === 'on') {
          allowed = false;
        }
        else {
          allowed = true;
        }
        break;
      };
    }
    return allowed;
  }
  policyEnforcement() {
    const allow: boolean = this.policyChecker();
    this.appliances.forEach((appliance, index) => {
      if (appliance === this.requestedAppliance) {
        if (allow) {
          this.applianceState[index] = this.requestedOperation;
          this.updateAppOp();
          this.updateMasterMessage(index);
        } else {
          this.rejectedRequest(index);
        }
      }
    });

  }
  getDweet() {
    this.service.getLatestDweet().subscribe((data: any) => {
      if (data && data?.with) {
        this.content = data.with[0];
        this.content.created = new Date(this.content.created);
        this.requestedAppliance = this.content.content.appliance;
        this.requestedOperation = this.content.content.operation;
        if (this.requestedAppliance === 'revoke' || this.requestedOperation === 'revoke') {
          this.showRequest = false;
        } else {
          if (this.lastFetchTime && this.lastFetchTime !== this.content.created) {
            this.lastFetchTime = this.content.created;
            this.policyEnforcement();
          } else {
            this.lastFetchTime = this.content.created;
          }
          this.showRequest = true;
        }
        this.listenDweets();
      }
    });
  }
  createDweet(appliance: string, operation: string) {
    const payload: request = {
      appliance: appliance,
      operation: operation
    };
    this.service.createDweet(payload).subscribe((data: any) => {
      if (data && data?.with?.transaction) {
        setTimeout(() => {
          this.getDweet();
        }, 1000)
      }
    });
  }
  listenDweets() {
    setTimeout(() => {
      this.getDweet();
    }, 1000);
  }
}
