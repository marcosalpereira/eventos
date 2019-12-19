import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CanAccessEventGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router) {}

  async canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot) {
    const eventId = next.paramMap.get('id');
    const granted = await this.authService.userCanAccessEvent(eventId);
    if (!granted) {
      this.router.navigate(['/no-permission']);
    }
    return granted;
  }
}
