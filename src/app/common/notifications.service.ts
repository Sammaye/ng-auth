import {Injectable} from '@angular/core';
import {NotificationsService as BaseNotificationsService} from 'angular2-notifications';

@Injectable({
  providedIn: 'root',
})
export class NotificationsService {
  options = {
    showProgressBar: true,
    pauseOnHover: false,
    clickToClose: false,
  };

  constructor(
    // Uses ng2-simple-notification module
    private notificationsService: BaseNotificationsService
  ) {
  }

  success(title: string, msg: string, time: number) {
    this.notificationsService.success(title, msg, Object.assign({timeOut: time}, this.options))
  }

  error(title: string, msg: string, time: number) {
    this.notificationsService.error(title, msg, Object.assign({timeOut: time}, this.options))
  }

  info(title: string, msg: string, time: number) {
    this.notificationsService.info(title, msg, Object.assign({timeOut: time}, this.options))
  }

  warning(title: string, msg: string, time: number) {
    this.notificationsService.warn(title, msg, Object.assign({timeOut: time}, this.options))
  }

  alert(title: string, msg: string, time: number) {
    this.notificationsService.alert(title, msg, Object.assign({timeOut: time}, this.options))
  }
}
