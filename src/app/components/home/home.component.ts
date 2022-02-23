import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AuthenticationService, TokenPayload, UserDetails} from '../../services/authentication.service';
import {CardanoPayLoad, CardanoService} from '../../services/cardano.service';
import {AlertService} from "../../shared/alert/alert.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})


export class HomeComponent implements OnInit {
  private alertSubscription: any;
  private alerts: [];
  public orderDetails: CardanoPayLoad = {
    cardanoAddress: '',
    cardanoAmount: '',
    fiatAmount: '0',
  };

  constructor(private router: Router, private http: HttpClient, private auth: AuthenticationService, private cardano: CardanoService, private alertService: AlertService) {
  }

  ngOnInit(): void {
  }

  onChange(UpdatedValue: string): void {
    this.cardano.getCoinPrice().subscribe(data => {
      this.orderDetails.fiatAmount = (parseFloat(UpdatedValue) * parseFloat(data)).toFixed(2);
    });
  }
  ngOnDestroy() {
    this.alertService.clear();
  }
  submitOrder(): void {
    if(!this.auth.isLoggedIn()) this.router.navigateByUrl('/login');

    this.alertService.clear();
    let model = this.orderDetails;
    if (parseInt(model.fiatAmount) < 1)
      return this.alertService.warn('Too small FIAT amount for purchase.');
    if (parseInt(model.cardanoAmount) < 1)
      return this.alertService.warn('Too small ADA amount for purchase.');

    this.cardano.createOrder(this.orderDetails).subscribe((data) => {
      window.location.href = data.redirect_url
      console.log(data)
    })
  }
}
