import { Component } from '@angular/core';
import { AuthenticationService } from './services/authentication.service';
import {ModalDismissReasons, NgbModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  constructor(public auth: AuthenticationService, private modalService: NgbModal) {}
  title = 'Profile';

  closeResult: string = '';
  /**
   * Write code on Method
   *
   * @return response()
   */
  open(content:any) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      console.log(result)
    });
  }

}
