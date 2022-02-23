import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import { environment } from "../../environments/environment";
import {AuthenticationService} from './authentication.service';
import {loadStripe} from '@stripe/stripe-js';

export interface CardanoPayLoad {
  cardanoAddress: string;
  cardanoAmount: string;
  fiatAmount: string;
}
export interface TransactionObject {
  _id: string;
  transactionStatus: string;
  user_id: string;
  quantity: number;
  ada_address: string;
  fiat_amount: string;
  createdAt: string;
  payment_id: string;
}
@Injectable({
  providedIn: 'root'
})
export class CardanoService {

  constructor(private http: HttpClient, private auth: AuthenticationService) { }
  public getCoinPrice(): Observable<any> {
    return this.http.get(`${environment.baseUrl}/api/transactions/coin-price`, { headers: { Authorization: `Bearer ${this.auth.getToken()}` } });
  }
  public createOrder(order: CardanoPayLoad): Observable<any> {
    return this.http.post(`${environment.baseUrl}/api/transactions/create`, order, { headers: { Authorization: `Bearer ${this.auth.getToken()}` } });
  }
  public getTransactions(): Observable<any>{
    return this.http.get(`${environment.baseUrl}/api/transactions/`,{ headers: { Authorization: `Bearer ${this.auth.getToken()}` } })
  }

  getTransactionDetails(id: any) {
    return this.http.get(`${environment.baseUrl}/api/transactions/${id}`,{ headers: { Authorization: `Bearer ${this.auth.getToken()}` } })

  }
}
