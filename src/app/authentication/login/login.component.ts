import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {NotificationsService} from '../../common/notifications.service';
import {SessionService} from "../../common/session.service";
import {Title} from "@angular/platform-browser";
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-splash',
  templateUrl: 'login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  showPassword: boolean = false;

  constructor(
    private titleService: Title,
    private router: Router,
    private formBuilder: FormBuilder,
    private sessionService: SessionService,
    private notificationService: NotificationsService,
    private http: HttpClient,
  ) {
  }

  ngOnInit(): void {
    this.titleService.setTitle(`${environment.appName} | Login`);

    this.loginForm = this.formBuilder.group({
      email: [
        '',
        [
          Validators.required,
          Validators.pattern('^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$'),
        ],
      ],
      password: [
        '',
        Validators.required
      ],
    });
  }

  login(value: any) {
    this.http.post(
      `${environment.origin}${this.sessionService.roleUrl('login')}`,
      {email: value.email, password: value.password}
    ).subscribe((result: any) => {
        if (result.message == "login credential expire") {
          this.notificationService.error('Login Expire', 'Login credential expire', 1000);
        } else {

          if (result.cData) {
            this.sessionService.user = result.cData;
          }

          this.notificationService.success('Login', 'Logged In Successfully', 1000);
          this.router.navigate([this.sessionService.roleUrl('dashboard')]);
        }
      },
      error => {
        this.notificationService.error('Error', `User email and password combination do not match a registered user`, 1000);
      });
  }
}
