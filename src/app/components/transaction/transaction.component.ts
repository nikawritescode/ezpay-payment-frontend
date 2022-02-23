import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Params} from "@angular/router";
import {CardanoService} from "../../services/cardano.service";

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.css']
})
export class TransactionComponent implements OnInit {
  routeParams: Params;
  transactionDetails: any;
  constructor(private activatedRoute: ActivatedRoute, private cardanoService: CardanoService) {   }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe( params => {
      this.routeParams = params;
    });
    this.cardanoService.getTransactionDetails(this.routeParams['id']).subscribe({
      next: (transaction) => this.transactionDetails = transaction,
      error: (e) => console.error(e),
    })
  }
  openExplorer(){
    window.open(`https://testnet.cardanoscan.io/transaction/${this.transactionDetails.cardanoTransactionId}`, '_blank');
  }
}
