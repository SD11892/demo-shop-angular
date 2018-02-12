import { Component, OnInit } from '@angular/core';
import { DecimalPipe } from '@angular/common';

import { Product } from '../shared/product.model';

import { ProductService } from '../shared/product.service';

@Component({
  selector: 'app-products',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.scss']
})
export class ProductsListComponent implements OnInit {
  products: Product[];
  displayMode: string;

  constructor(private productService: ProductService) { }

  ngOnInit() {
    this.displayMode = 'grid';
    this.getProducts();
  }

  getProducts() {
    this.productService.getProducts()
      .subscribe(products => {
        this.products = products;
      });
  }

  onDisplayModeChange(mode: string, e: Event) {
    this.displayMode = mode;
    e.preventDefault();
  }
}
