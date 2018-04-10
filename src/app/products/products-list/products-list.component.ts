import { Component, OnInit } from '@angular/core';
import { DecimalPipe } from '@angular/common';

import { Product } from '../../models/product.model';

import { ProductService } from '../shared/product.service';
import { PagerService } from '../../pager/pager.service';
import { SortPipe } from '../shared/sort.pipe';
// import { OLDProductsCacheService } from '../shared/products-cache.service';
import { AuthService } from '../../account/shared/auth.service';
import { User } from '../../models/user.model';
import { UiService } from '../shared/ui.service';
import { ProductsCacheService } from '../shared/products-cache.service';

@Component({
  selector: 'app-products',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.scss']
})
export class ProductsListComponent implements OnInit {
  products: Product[];
  productsPaged: Product[];
  pager: any = {};
  user: User;
  productsLoading: boolean;
  currentPagingPage: number;

  constructor(
    private productService: ProductService,
    // private _productsCacheService: OLDProductsCacheService,
    private productsCacheService: ProductsCacheService,
    private pagerService: PagerService,
    private sortPipe: SortPipe,
    private authService: AuthService,
    public uiService: UiService
  ) {}

  ngOnInit() {
    this.authService.user.subscribe((user) => {
      this.user = user;
    });
    this.uiService.currentPagingPage$.subscribe((page) => {
      this.currentPagingPage = page;
    });
    this.getProducts();
  }

  getProducts() {
    this.productsLoading = true;
    this.productsCacheService
      .get('products', this.productService.getProducts())
      .subscribe((products) => {
        this.products = products;
        this.setPage(this.currentPagingPage);
        this.productsLoading = false;
      });
  }

  onDisplayModeChange(mode: string, e: Event) {
    this.uiService.displayMode$.next(mode);
    e.preventDefault();
  }

  setPage(page: number) {
    if (page < 1 || page > this.pager.totalPages) {
      return;
    }
    this.pager = this.pagerService.getPager(this.products.length, page, 8);
    this.productsPaged = this.products.slice(
      this.pager.startIndex,
      this.pager.endIndex + 1
    );
    this.uiService.currentPagingPage$.next(page);
  }

  onSort(sortBy: string) {
    this.sortPipe.transform(
      this.products,
      sortBy.replace(':reverse', ''),
      sortBy.endsWith(':reverse')
    );
    this.uiService.sorting$.next(sortBy);
    this.setPage(1);
  }
}
