import { Component, OnInit, SimpleChanges } from '@angular/core';
import { CartService } from '../../cart/shared/cart.service';
import { CartItem } from '../../models/cart-item.model';
import { CheckoutService } from '../shared/checkout.service';
import { Customer } from '../../models/customer.model';
import { Order } from '../../models/order.model';
import { OrderService } from '../../account/orders/shared/order.service';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { AuthService } from '../../account/shared/auth.service';
import { MessageService } from '../../messages/message.service';

@Component({
  selector: 'app-checkout-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss']
})
export class ReviewComponent implements OnInit {
  items: CartItem[];
  total: number;
  customer: Customer;
  paymentMethod: string;

  constructor(
    private cartService: CartService,
    private checkoutService: CheckoutService,
    private orderService: OrderService,
    private router: Router,
    private authService: AuthService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.items = this.cartService.getItems();
    this.total = this.cartService.getTotal();
    this.cartService.itemsChanged.subscribe((items: CartItem[]) => {
      this.items = items;
      this.total = this.cartService.getTotal();
    });
    this.customer = this.checkoutService.getOrderInProgress().customer;
    this.checkoutService.orderInProgressChanged.subscribe((order: Order) => {
      this.customer = order.customer;
      this.paymentMethod = order.paymentMethod;
    });
  }

  onBack() {
    this.checkoutService.previousStep();
  }

  onCompleteOrder() {
    const userUid = this.authService.getUserUid();
    const order = this.checkoutService.getOrderInProgress();
    const total = this.cartService.getTotal();

    this.checkoutService.setOrderItems(this.cartService.getItems());

    if (userUid) {
      this.submitUserOrder(order, total, userUid);
    } else {
      this.submitAnonOrder(order, total);
    }
  }

  submitUserOrder(order, total, userUid) {
    this.orderService.addUserOrder(order, total, userUid).subscribe(
      (response) => {
        console.log(response);
        this.cartService.clearCart();
        this.checkoutService.resetSteps();
        this.router.navigate(['/order-complete']);
      },
      (error) => {
        console.log(error);
        this.messageService.addError('Could not submit order, try again.');
      }
    );
  }

  submitAnonOrder(order, total) {
    this.orderService.addAnonymousOrder(order, total).subscribe(
      (response) => {
        console.log(response);
        this.cartService.clearCart();
        this.checkoutService.resetSteps();
        this.router.navigate(['/order-complete']);
      },
      (error) => {
        console.log(error);
        this.messageService.addError('Could not submit order, try again.');
      }
    );
  }
}
