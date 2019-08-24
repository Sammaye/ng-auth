import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {NotificationsService} from '../../common/notifications.service';
import {SessionService} from "../../common/session.service";

@Component({
  template: ``,
})
export class LogoutComponent implements OnInit {
  constructor(
    private router: Router,
    private notificationService: NotificationsService,
    private sessionService: SessionService,
  ) {
  }

  ngOnInit() {
    let loginUrl = this.sessionService.roleUrl('login');

    this.sessionService.clear();
    this.notificationService.success('Logout', 'Logged Out Successfully', 1000);
    this.router.navigate([loginUrl]);
  }
}
