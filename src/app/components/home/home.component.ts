import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AuthenticationService, TokenPayload, UserDetails} from '../../services/authentication.service';
import {CardanoPayLoad, CardanoService} from '../../services/cardano.service';
import {AlertService} from "../../shared/alert/alert.service";
import {Router} from "@angular/router";

declare var paypal: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})


export class HomeComponent implements OnInit {
  @ViewChild('paypal', {static: true}) paypalElement: ElementRef;

  private alertSubscription: any;
  private alerts: [];
  public paypalSuccess: Boolean = false;
  public orderDetails: CardanoPayLoad = {
    cardanoAddress: '',
    cardanoAmount: '',
    fiatAmount: '0',
    payPalTransactionId: ''
  };

  constructor(private router: Router, private http: HttpClient, public auth: AuthenticationService, private cardano: CardanoService, private alertService: AlertService) {
  }

  ngOnInit(): void {
    if (this.auth.isLoggedIn()) {
      paypal
        .Buttons({
          createOrder: (data: any, actions: any) => {
            this.alertService.clear();
            let model = this.orderDetails;
            if (parseInt(model.fiatAmount) < 1)
              return this.alertService.warn('Too small FIAT amount for purchase.');
            if (parseInt(model.cardanoAmount) < 1)
              return this.alertService.warn('Too small ADA amount for purchase.');

            return actions.order.create({
              purchase_units: [
                {
                  description: "Buy " + this.orderDetails.cardanoAmount + " cardano.",
                  amount: {
                    currency_code: 'USD',
                    value: this.orderDetails.fiatAmount
                  }
                }
              ]
            });
          },
          onApprove: async (data: any, actions: any) => {
            const order = await actions.order.capture();
            this.paypalSuccess = true;
            this.orderDetails.payPalTransactionId = order.id;
            console.log(order);
            this.cardano.createPayPalOrder(this.orderDetails).subscribe((data) => {
              window.location.href = data.redirect_url
            })
          },
          onError: (err: any) => {
            return this.alertService.error('Cannot process paypal transaction.');
          }
        })
        .render(this.paypalElement.nativeElement);
    }
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
    if (!this.auth.isLoggedIn()) this.router.navigateByUrl('/login');

    this.alertService.clear();
    let model = this.orderDetails;
    if (parseInt(model.fiatAmount) < 1)
      return this.alertService.warn('Too small FIAT amount for purchase.');
    if (parseInt(model.cardanoAmount) < 1)
      return this.alertService.warn('Too small ADA amount for purchase.');

    this.cardano.createOrder(this.orderDetails).subscribe((data) => {
      window.location.href = data.redirect_url
    })
  }
}
