import { Component, OnInit, Input } from '@angular/core';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';
import { CheckoutService } from '../../checkout.service';
import { Customer } from '../../model/customer.model';

@Component({
  selector: 'app-checkout-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss']
})
export class AddressComponent implements OnInit {
  formAddress: FormGroup;
  countries: string[];

  constructor(private checkoutService: CheckoutService) { }

  ngOnInit() {
    this.countries = ['Switzerland'];
    this.formAddress = new FormGroup({
      'firstname': new FormControl(null, Validators.required),
      'lastname': new FormControl(null, Validators.required),
      'address1': new FormControl(null, Validators.required),
      'address2': new FormControl(null),
      'zip': new FormControl(null, [Validators.required, Validators.pattern(/^\d\d\d\d$/)]),
      'city': new FormControl(null, Validators.required),
      'email': new FormControl(null, Validators.email),
      'phone': new FormControl(null),
      'company': new FormControl(null),
      'country': new FormControl({ value: this.countries[0], disabled: false})
    });
  }

  onContinue() {
    this.checkoutService.orderInProgress.customer = new Customer();
    this.checkoutService.orderInProgress.customer = this.formAddress.value;
    this.checkoutService.nextStep();
  }
}
