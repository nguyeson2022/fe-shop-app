import { NgModule, importProvidersFrom } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { OrderComponent } from './components/order/order.component';
import {AuthGuardFn} from "./guards/auth.guard";
import {AdminGuardFn} from "./guards/admin.guard";
import {UserProfileComponent} from "./components/user-profile/user.profile.component";
import {AdminComponent} from "./components/admin/admin.component";
import {ProductListComponent} from "./components/product_list/product-list.component";
import { DetailProductComponent } from './components/detail-product/detail-product.component';
import { OrderDetailComponent } from './components/detail-order/order.detail.component';
import { ArticleComponent } from './components/article/article.component';
import { PaymentCheckoutComponent } from './components/payment-checkout/payment-checkout.component';

 const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'products/:id', component: DetailProductComponent },
  { path: 'orders', component: OrderComponent, canActivate:[AuthGuardFn]},
  { path: 'payment-checkout', component: PaymentCheckoutComponent, canActivate:[AuthGuardFn]},
  { path: 'user-profile', component: UserProfileComponent, canActivate:[AuthGuardFn]},
  { path: 'orders/:id', component: OrderDetailComponent },
  { path: 'product-list', component: ProductListComponent },
  { path: 'articles', component: ArticleComponent },
  { path: 'articles/:id', component: ArticleComponent },
  //Admin
  {
    path: 'admin',
    component: AdminComponent,
    canActivate:[AdminGuardFn]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes),
  CommonModule],
  exports: [RouterModule]
})

export class AppRoutingModule{}
