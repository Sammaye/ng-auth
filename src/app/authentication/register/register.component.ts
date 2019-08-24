import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {UserService} from "../../user/user.service";
import {SessionService} from "../../common/session.service";
import {Router} from "@angular/router";
import {Title} from "@angular/platform-browser";
import {environment} from "../../../environments/environment";
import {AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators} from "@angular/forms";
import {Observable, of} from "rxjs";
import {catchError, map} from "rxjs/operators";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  details = {
    name: '',
    email: '',
    country: '',
  };
  submitted: boolean = false;
  form: FormGroup;

  constructor(
    private userService: UserService,
    private sessionService: SessionService,
    private router: Router,
    private titleService: Title,
    private formBuilder: FormBuilder,
  ) {
  }

  ngOnInit() {
    this.titleService.setTitle(`${environment.appName} | Register `);

    this.form = this.formBuilder.group({
      name: [this.details.name, [
        Validators.required,
        Validators.minLength(5),
      ]],
      email: [this.details.email, [
        Validators.required,
        Validators.email,
      ], this.validateEmailNotTaken.bind(this), {updateOn: 'blur'}],
      country: [this.details.country, [
        Validators.required,
        Validators.pattern('^[a-zA-Z]{2,}$'),
      ]],
    });
  }

  validateEmailNotTaken(control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    if (this.details.email === control.value) {
      return of ([]);
    }

    return this.userService.emailStatusCheck(control.value).pipe(
      map((res: any) => {
        return res.message === "No Email Found" ? null : {emailTaken: true};
      }),
      catchError((res: any) => {
        return of({emailTaken: true});
      })
    );
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.valid) {
      // Shazam
    }
  }
}
