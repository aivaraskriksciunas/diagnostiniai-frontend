import { Component, OnInit } from '@angular/core';
import { ToastNotificationService, Notification, NotificationType } from '../../services/toast-notification.service';

@Component({
  selector: 'app-toast-notifications',
  templateUrl: './toast-notifications.component.html',
  styleUrls: ['./toast-notifications.component.scss']
})
export class ToastNotificationsComponent implements OnInit {

  public notifications : Notification[];

  constructor( private notificationService: ToastNotificationService ) { }

  ngOnInit() {
    this.notificationService.getNotificationSubject().subscribe(
      notif => {
        this.notifications = notif;
      }
    );
  }

  public removeNotification( notification : Notification ) {
    this.notificationService.expireNotification( notification );
  }

}
