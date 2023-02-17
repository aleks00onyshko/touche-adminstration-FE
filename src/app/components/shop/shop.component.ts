import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { SpinnerComponent } from '../../shared/components/spinner/spinner.component';
import { initialState, ShopStore } from './shop.store';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { CategoriesComponent } from './categories/categories.component';
import { ProductsComponent } from './products/products.component';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [
    CommonModule,
    MatSidenavModule,
    MatCardModule,
    SpinnerComponent,
    MatDialogModule,
    RouterModule,
    CategoriesComponent,
    ProductsComponent
  ],
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss'],
  providers: [ShopStore],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShopComponent implements OnInit {
  constructor(private route: ActivatedRoute, public shopStore: ShopStore) {}

  public ngOnInit(): void {
    this.shopStore.setState({ ...initialState, id: this.route.snapshot.paramMap.get('id') ?? '' });
    this.shopStore.getCategories$();
  }
}
