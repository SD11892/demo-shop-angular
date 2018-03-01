import { Component, OnInit } from '@angular/core';
import { CheckoutService } from './checkout.service';

import { UserDetails } from '../models/user.model';
import { AuthenticationService } from '../account/authentication.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  steps: string[];
  activeStep: number;

  constructor(
    private checkoutService: CheckoutService,
    private auth: AuthenticationService
  ) {}

  ngOnInit() {
    this.steps = ['1. Address', '2. Shipping', '3. Payment', '4. Review'];
    this.activeStep = this.checkoutService.activeStep;
    this.checkoutService.stepChanged.subscribe((step: number) => {
      this.activeStep = step;
    });
  }
}
