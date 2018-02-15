import { Component, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { ProductService } from '../products/shared/product.service';
import { ProductsCacheService } from '../products/shared/products-cache.service';
import { Product } from '../products/shared/product.model';

const placeholderProduct: Product = {
  id: 999,
  date: new Date().toString(),
  name: 'Placeholder',
  description: 'Come up with something descriptive',
  price: 999,
  priceNormal: 1999,
  imageURLs: ['img/shop/products/13.jpg'],
  categories: ['Some', 'Example', 'Categories']
};

@Component({
  selector: 'app-add-edit',
  templateUrl: './add-edit.component.html',
  styleUrls: ['./add-edit.component.scss']
})
export class AddEditComponent implements OnInit {
  productForm: FormGroup;

  product: Product;
  id: any;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private productsCacheService: ProductsCacheService
  ) {
    this.product = placeholderProduct;
  }
  ngOnInit(): void {
    this.setProduct();
    this.initForm();
  }
  initForm() {
    this.productForm = new FormGroup({});
  }
  setProduct() {
    this.route.params.subscribe((params: Params) => {
      this.id = +this.route.snapshot.paramMap.get('id');

      this.getProduct();
    });
  }
  getProduct(): void {
    if (this.id) {
      console.log(this.id);
      // this.productsCacheService
      // .get(this.id, this.productService.getProduct(this.id))
      // .subscribe((product) => {
      //   this.product = product;
      // });
    }
  }
}
