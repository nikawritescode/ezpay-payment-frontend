import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {environment} from "../../environments/environment";

export interface UserDetails {
  _id: string;
  email: string;
  name: string;
  exp: number;
  iat: number;
}

interface TokenResponse {
  token: string;
}

export interface TokenPayload {
  email: string;
  password: string;
  name?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private token: string | null;

  constructor(private http: HttpClient, private router: Router) {}

  private saveToken(token: string): void {
    localStorage.setItem('cardano-token', token);
    this.token = token;
  }

  public getToken(): any {
    if (!this.token) {
      this.token = localStorage.getItem('cardano-token');
    }
    return this.token;
  }

  private request(
    method: 'post' | 'get',
    type: 'auth/login' | 'users/register' | 'users/profile' | 'blockchain/coin-price',
    user?: TokenPayload
  ): Observable<any> {
    let base$;

    if (method === 'post') {
      base$ = this.http.post(`${environment.baseUrl}/api/${type}`, user);
    } else {
      base$ = this.http.get(`${environment.baseUrl}/api/${type}`, {
        headers: { Authorization: `Bearer ${this.getToken()}` }
      });
    }

    return base$.pipe(
        map((data: any) => {
          if (data.token) {
            this.saveToken(data.token);
          }
          return data;
        })
    );
  }

  public logout(): void {
    this.token = '';
    window.localStorage.removeItem('cardano-token');
    this.router.navigateByUrl('/');
  }

  public getUserDetails(): UserDetails | null {
    const token = this.getToken();

    let payload;
    if (token) {
      payload = token.split('.')[1];
      payload = window.atob(payload);
      return JSON.parse(payload);
    } else {
      return null;
    }
  }

  public isLoggedIn(): boolean {
    const user = this.getUserDetails();
    if (user) {
      return user.exp > Date.now() / 1000;
    } else {
      return false;
    }
  }

  public register(user: TokenPayload): Observable<any> {
    return this.request('post', 'users/register', user);
  }

  public login(user: TokenPayload): Observable<any> {
    return this.request('post', 'auth/login', user);
  }

  public profile(): Observable<any> {
    return this.request('get', 'users/profile');
  }

}
