import { AdminComponent } from "./admin.component";
import { OrderAdminComponent } from "./order/order.admin.component";
import { DetailOrderAdminComponent } from "./detail-order/detail.order.admin.component";
import { Route, Router,Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { ProductAdminComponent } from "./product/product.admin.component";
import { CategoryAdminComponent } from "./category/category.admin.component";
import {UpdateProductAdminComponent} from "./product/update/update.product.admin.component";
import {InsertProductAdminComponent} from "./product/insert/insert.product.admin.component";
import {UserAdminComponent} from "./user/user.admin.component";
import {UpdateCategoryAdminComponent} from "./category/update/update.category.admin.component";
import {InsertCategoryAdminComponent} from "./category/insert/insert.category.admin.component";
import {InsertUserAdminComponent} from "./user/insert/insert.user.admin.component";
import {UpdateUserAdminComponent} from "./user/update/update.user.admin.component";
import {AdminGuardFn} from "../../guards/admin.guard";
import {ProductImageAdminComponent} from "./product_image/product_image.admin.component";
import {InsertProductImageAdminComponent} from "./product_image/insert/insert.product_image.admin.component";
import { ArticleAdminComponent } from "./article/article.admin.component";
import { DashboardAdminComponent } from "./dashboard/dashboard.admin.component";
import { CommentAdminComponent } from "./comment/comment.admin.component";
import { UpdateCommentAdminComponent } from "./comment/update/update.comment.admin.component";
import { CouponAdminComponent } from "./coupon/coupon.admin.component";
import { UpdateCouponAdminComponent } from "./coupon/update/update.coupon.admin.component";
import { InsertCouponAdminComponent } from "./coupon/insert/insert.coupon.admin.component";
import { UpdateArticleAdminComponent } from "./article/update/update.article.admin.component";
import { InsertArticleAdminComponent } from "./article/insert/insert.article.admin.component";
import { UploadArticleAdminComponent } from "./article/upload/upload.article.component";
import { UploadCategoryAdminComponent } from "./category/upload/upload.category.component";
import { AddCouponAdminComponent } from "./coupon/addCoupon/add.coupon.admin.component";


export const routes: Routes = [
  {
    path: 'admin',
    component: AdminComponent,
    children: [
      {
        path: 'orders',
        component: OrderAdminComponent
      },
      {
        path: 'products',
        component: ProductAdminComponent
      },
      {
        path: 'categories',
        component: CategoryAdminComponent
      },
      {
        path: 'users',
        component: UserAdminComponent,
      },
      {
        path: 'articles',
        component: ArticleAdminComponent,
      },
      {
        path: 'product_images',
        component: ProductImageAdminComponent,
      },
      {
        path: 'dashboard',
        component: DashboardAdminComponent
      },
      {
        path: 'comments',
        component: CommentAdminComponent
      },
      {
        path: 'coupons',
        component: CouponAdminComponent
      },
      //sub path
      {
        path: 'orders/:id',
        component: DetailOrderAdminComponent
      },
      {
        path: 'products/update/:id',
        component: UpdateProductAdminComponent
      },
      {
        path: 'products/insert',
        component: InsertProductAdminComponent
      },
       //categories
      {
        path: 'categories/update/:id',
        component: UpdateCategoryAdminComponent
      },
      {
        path: 'categories/insert',
        component: InsertCategoryAdminComponent
      },
      {
        path: 'categories/upload/:id',
        component: UploadCategoryAdminComponent
      },
      {
        path: 'users/insert',
        component: InsertUserAdminComponent
      },
      {
        path: 'users/update/:id',
        component: UpdateUserAdminComponent
      },
      {
        path: 'product_images/insert',
        component: InsertProductImageAdminComponent
      },
      {
        path: 'comments/update/:id',
        component: UpdateCommentAdminComponent
      },
      {
        path: 'coupons/update/:id',
        component: UpdateCouponAdminComponent
      },
      {
        path: 'coupons/insert',
        component: InsertCouponAdminComponent
      },
      {
        path: 'coupons/add',
        component: AddCouponAdminComponent
      },
      {
        path: 'articles/update/:id',
        component: UpdateArticleAdminComponent
      },
      {
        path: 'articles/upload/:id',
        component: UploadArticleAdminComponent
      },
      {
        path: 'articles/insert',
        component: InsertArticleAdminComponent
      }

    ]
  }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [RouterModule]
})
export class AdminRoutingModule { }

