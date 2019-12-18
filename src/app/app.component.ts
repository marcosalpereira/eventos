import { Component, OnInit, OnDestroy } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from './model/user';
import { AuthService } from './auth/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(map(result => result.matches));

  loggedUser: User;
  authDataSub: Subscription;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.authDataSub = this.authService.authData$.subscribe(user => {
      this.loggedUser = user;
      if (!user) {
        this.router.navigateByUrl('/login');
      }
    });
  }

  ngOnDestroy() {
    if (this.authDataSub) {
      this.authDataSub.unsubscribe();
    }
  }

  logout() {
    this.authService.loggout();
  }
}
