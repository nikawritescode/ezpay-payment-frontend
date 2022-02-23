import { Component } from '@angular/core';
import { AuthenticationService, TokenPayload } from '../../services/authentication.service';
import { Router } from '@angular/router';
import { faKey, faUser, faArrowRight} from '@fortawesome/free-solid-svg-icons';

@Component({
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  credentials: TokenPayload = {
    email: '',
    name: '',
    password: ''
  };

  constructor(private auth: AuthenticationService, private router: Router) {}
  faUser = faUser;
  faKey = faKey;
  faArrowRight = faArrowRight;
  register() {
    this.auth.register(this.credentials).subscribe(
      () => {
        this.router.navigateByUrl('/');
      },
      err => {
        console.error(err);
      }
    );
  }
}
