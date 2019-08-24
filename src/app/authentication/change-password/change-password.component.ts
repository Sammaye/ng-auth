import {Component, OnInit} from '@angular/core';
import {FormGroup, FormBuilder, Validators, ValidatorFn, AbstractControl} from '@angular/forms';
import {NotificationsService} from '../../common/notifications.service';
import {Router} from '@angular/router';
import {Location} from '@angular/common';
import {SessionService} from "../../common/session.service";
import {Title} from "@angular/platform-browser";
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-splash',
  templateUrl: 'change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  changePasswordForm: FormGroup;
  showPassword: boolean = false;

  constructor(
    private router: Router,
    public formBuilder: FormBuilder,
    private sessionService: SessionService,
    private notificationService: NotificationsService,
    private titleService: Title,
    private http: HttpClient,
    private location: Location,
  ) {
  }

  ngOnInit(): void {
    this.titleService.setTitle(`${environment.appName} | Change Password`);

    this.changePasswordForm = this.formBuilder.group({
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    }, {validators: this.comparePasswords()})
  }

  comparePasswords(): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
      return control.get('password').value !== control.get('confirmPassword').value
        ? {'confirmPasswordNotMatch': true}
        : null;
    };
  }

  changePassword(password) {
    this.http.post(
      `${environment.origin}${this.sessionService.roleUrl('changePassword')}`,
      {newPassword: password}
    ).subscribe((result) => {
        this.notificationService.success('Password Reset', 'PasswordChanged', 1000);
        this.router.navigate([this.sessionService.roleUrl('dashboard')]);
      },
      error => {
        this.notificationService.error('Error', 'Error Changing Password', 1000);
      });
  }

  goBack() {
    this.location.back();
  }
}
