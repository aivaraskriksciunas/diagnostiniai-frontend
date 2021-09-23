import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export enum NotificationType {
  ERROR = 'danger',
  SUCCESS = 'success',
  INFO = 'info'
}

export interface Notification {
  message: string,
  title: string,
  timeout: number,
  type: NotificationType
}

@Injectable({
  providedIn: 'root'
})
export class ToastNotificationService {

  private messages : Notification[];
  private messagesSubject : Subject<Notification[]>;

  constructor() { 
    this.messagesSubject = new Subject();
    this.messages = [];
  }

  public getNotificationSubject() : Subject<Notification[]> {
    return this.messagesSubject;
  }

  public pushNotification( notification : Notification ) : Notification {
    this.messages = [ notification ].concat( this.messages );

    if ( notification.timeout != 0 ) {
      setTimeout( () => this.expireNotification( notification ), notification.timeout );
    }

    this.messagesSubject.next( this.messages );
    return notification;
  }

  public updateNotification( notification : Notification ) : Notification {
    let index = this.messages.indexOf( notification );
    if ( index == -1 ) return null;
    
    this.messages.splice( index, 1 );
    return this.pushNotification( notification );
  }
 
  public pushInfoNotification( title : string, message : string, timeout : number ) {
    return this.pushNotification({
      title: title,
      message: message,
      timeout: timeout,
      type: NotificationType.INFO
    });
  }

  public pushErrorNotification( title : string, message : string, timeout : number ) {
    return this.pushNotification({
      title: title,
      message: message,
      timeout: timeout,
      type: NotificationType.ERROR
    });
  }

  public pushSuccessNotification( title : string, message : string, timeout : number ) {
    return this.pushNotification({
      title: title,
      message: message,
      timeout: timeout,
      type: NotificationType.SUCCESS
    });
  }

  public pushAjaxLoadingNotification() {
    return this.pushNotification({
      title: "Vykdoma užklausa...",
      message: "prašome palaukti",
      timeout: 0,
      type: NotificationType.INFO
    })
  }

  public expireNotification( notification : Notification ) {
    let itemIndex = this.messages.indexOf( notification );
    if ( itemIndex == -1 ) return;

    // Remove notification from array
    this.messages.splice( itemIndex, 1 );
    this.messagesSubject.next( this.messages );
  }
}
