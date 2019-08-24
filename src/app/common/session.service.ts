import {Injectable, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable, of} from "rxjs";
import {environment} from "../../environments/environment";
import {catchError, map} from "rxjs/operators";

declare let analytics: any;

@Injectable({
  providedIn: 'root',
})
export class SessionService implements OnInit {
  public isNewFormat: boolean = false;
  private _user: { [k: string]: any };
  private isIdentified: boolean = false;
  private fieldCache: string[];

  constructor(
    private http: HttpClient,
  ) {
  }

  ngOnInit(): void {
    if (localStorage.getItem('companyId')) {
      // This allows us to migrate old sessions to the new version
      if (this.authed) {
        this.user = {id: localStorage.getItem('companyId')};
        localStorage.removeItem('companyId');
      } else {
        this.clear();
      }
    }
  }

  set access_token(access_token: string) {
    localStorage.setItem('access_token', access_token);
  }

  get access_token(): string {
    return localStorage.getItem('access_token');
  }

  set role(role: string) {
    localStorage.setItem('role', role);
  }

  get role(): string {
    return localStorage.getItem('role');
  }

  get authed(): boolean {
    return this.access_token != undefined;
  }

  get timezone(): string {
    return new Date().toString().match(/([-\+][0-9]+)\s/)[1];
  }

  set user(user: { [k: string]: any }) {
    if (!user.hasOwnProperty('id')) {
      // there must at least be an ID
      throw new Error('You must supply at least an ID to set a user in the session');
    }

    if (
      typeof this._user !== 'object' ||
      // No ID
      !this._user.hasOwnProperty('id') ||
      // Or different ID
      parseInt(this._user.id) !== parseInt(user.id)
    ) {
      // Need to redo analytics
      this.isIdentified = false;
    }

    if (this.isAdmin()) {
      // Do not identify admins
      this.isIdentified = true;
    }

    this._user = user;
    this.fieldCache = [];

    for (let field in this._user) {
      this.fieldCache.push(field);

      let value = this._user[field];
      if (field === 'activeTill' || field === 'created') {
        if (isNaN(value)) {
          value = new Date(Date.parse(value));
        } else if (!(value instanceof Date)) {
          value = new Date(parseInt(value));
        }
      } else if (field === 'employee_count' || field === 'site_count' || field === 'id') {
        value = parseInt(value);
      }

      this._user[field] = value;
      localStorage.setItem('user.' + field, value);
    }

    if (this._user.hasOwnProperty('employee_count') && this._user.employee_count !== null) {
      this.isNewFormat = true;
    } else {
      this.isNewFormat = false;
    }

    if (!this.isIdentified) {
      analytics.identify(this._user.id, this._user);
      this.isIdentified = true;
    }
  }

  get user() {
    return this._user;
  }

  isUser() {
    return this.role === "user";
  }

  isAdmin() {
    return this.role === "admin";
  }

  check(force: boolean = false) {
    return new Observable((observer) => {
      if (this.authed) {
        if (localStorage.getItem('user.id')) {
          if (this.isAdmin()) {
            // Only an access_token is returned currently
            /*
            this._user = {
              id: localStorage.getItem('user.id'),
              email: localStorage.getItem('user.email'),
              created: localStorage.getItem('user.created'),
            };
             */
          } else {
            this._user = {
              id: localStorage.getItem('user.id'),
              name: localStorage.getItem('user.name'),
              email: localStorage.getItem('user.email'),
            };
          }
        }
      } else {
        this.clear();
      }

      if (
        this.isCompany() &&
        (!this.isNewFormat || force)
      ) {
        this.refresh().subscribe(res => {
          observer.next(res);
          observer.complete();
        });
      } else {
        observer.next(false);
        observer.complete();
      }

      return {
        unsubscribe(): void {
        }
      };
    });
  }

  refresh() {
    if (this.isAdmin()) {
      return of([]);
    }

    return this.http.post(`${environment.origin}/user/getuserdetails`, {})
      .pipe(
        map((data: { [k: string]: any }) => {
          this.user = data;
          return this.user;
        }),
        catchError(error => of([]))
      );
  }

  track(event, properties: { [k: string]: any } = {}) {
    return new Observable((observer) => {
      properties.userId = this.user.id;
      properties.email = this.user.email;
      properties.timestamp = new Date();

      analytics.track(event, properties);

      observer.next();
      observer.complete();

      return {
        unsubscribe(): void {
        }
      };
    });
  }

  clear() {
    this.access_token = undefined;
    this._user = undefined;
    this.isNewFormat = false;

    localStorage.removeItem('access_token');
    localStorage.removeItem('companyId');

    localStorage.removeItem('user.id');
    localStorage.removeItem('user.name');
    localStorage.removeItem('user.email');

    return true;
  }

  roleUrl(url) {
    return (this.isAdmin() ? '/admin/' : '/user/') + url;
  }
}
