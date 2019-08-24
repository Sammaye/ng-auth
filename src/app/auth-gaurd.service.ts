import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import {SessionService} from "./common/session.service";

@Injectable({
  providedIn: 'root',
})
export class AuthGaurdService implements CanActivate {
  constructor(
    private router: Router,
    private sessionService: SessionService,
  ) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    let role = state.url.indexOf('/admin') === 0 ? 'admin' : 'user';

    if (next.data.requireAuth) {
      if (!this.sessionService.authed) {
        this.router.navigate([this.sessionService.roleUrl('login')]);
      } else if (role !== this.sessionService.role) {
        this.router.navigate([this.sessionService.roleUrl('dashboard')]);
      }
    }

    if (
      (state.url).includes('/login') ||
      (state.url).includes('/forgotPassword') ||
      (state.url).includes('/register')
    ) {
      // These routes are not accessible if you are logged in
      if (this.sessionService.authed) {
        this.router.navigate([this.sessionService.roleUrl('dashboard')]);
      } else {
        this.sessionService.role = role;
      }
    }
    return true;
  }
}
