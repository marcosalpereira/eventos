import { Component, OnInit, NgZone } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private router: Router,
    private ngZone: NgZone) { }

  ngOnInit() {
    const sub = this.authService.authData$.subscribe(user => {
      console.log({user})
      if (user) {
        this.router.navigate(['/events-list']);
        // sub.unsubscribe();
        // this.ngZone.run( () => {
        //     console.log('navigate')
        //     this.router.navigate(['/events-list']);
        //   }
        // );
      }
    });
  }

  login() {
    this.authService.googleLoggin();
  }


}
