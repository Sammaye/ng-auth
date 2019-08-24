import {Component, OnInit} from '@angular/core';
import {FormGroup, Validators, FormControl} from '@angular/forms';
import {NotificationsService} from '../../common/notifications.service';
import {Router, NavigationExtras} from '@angular/router';
import {SessionService} from "../../common/session.service";
import {Title} from "@angular/platform-browser";
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-splash',
  templateUrl: 'forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  forgotPasswordForm: FormGroup;

  constructor(
    private titleService: Title,
    private router: Router,
    private http: HttpClient,
    private sessionService: SessionService,
    private notificationService: NotificationsService,
  ) {
  }

  ngOnInit(): void {
    this.titleService.setTitle(`${environment.appName} | Forgot Password`);

    this.forgotPasswordForm = new FormGroup({
      'email': new FormControl(null, [
        Validators.pattern('^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$'),
        Validators.required
      ]),
    });
  }

  forgotPassword(value) {
    this.http.post(
      `${environment.origin}${this.sessionService.roleUrl('forgotpassword')}`,
      {email: value.email}
    ).subscribe((success: any) => {
      if (success.message === "Email id not exists in the system") {
        this.notificationService.warning('Reset Fail', 'Email not found', 2000);
      } else {
        this.notificationService.success('Password', 'New password sent to email', 2000);
        this.goBack();
      }
    });
  }

  goBack() {
    return this.router.navigate([this.sessionService.roleUrl('login')]);
  }
}
