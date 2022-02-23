import { Component } from '@angular/core';
import { AuthenticationService, TokenPayload } from '../../services/authentication.service';
import { Router } from '@angular/router';
import { faKey, faUser, faArrowRight} from '@fortawesome/free-solid-svg-icons';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  credentials: TokenPayload = {
    email: '',
    password: ''
  };

  constructor(private auth: AuthenticationService, private router: Router) {}
  faUser = faUser;
  faKey = faKey;
  faArrowRight = faArrowRight;
  login() {
    this.auth.login(this.credentials).subscribe(
      () => {
        this.router.navigateByUrl('/');
      },
      err => {
        console.error(err);
      }
    );
  }
}
