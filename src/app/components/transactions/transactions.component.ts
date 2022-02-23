import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CardanoService} from "../../services/cardano.service";

interface Transactions {
  id: string;
  address: string;
  fiat: number;
  amount: number;
}

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css']
})
export class TransactionsComponent implements OnInit {
  transactions:any | null;
  transaction:any | null;


  constructor(private http: HttpClient, private cardanoService: CardanoService) {
  }

  ngOnInit(): void {
    this.cardanoService.getTransactions().subscribe({
        next: (transactions) => this.transactions = transactions,
        error: (e) => console.error(e),
      }
    );
  }

}
