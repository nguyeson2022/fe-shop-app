import {NgModule} from "@angular/core";
import {AdminComponent} from "./admin.component";
import {OrderAdminComponent} from "./order/order.admin.component";
import {DetailOrderAdminComponent} from "./detail-order/detail.order.admin.component";
import {ProductAdminComponent} from "./product/product.admin.component";
import {CategoryAdminComponent} from "./category/category.admin.component";
import {AdminRoutingModule} from "./admin-routing.module";
import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {UpdateProductAdminComponent} from "./product/update/update.product.admin.component";
import {InsertProductAdminComponent} from "./product/insert/insert.product.admin.component";
import {UpdateCategoryAdminComponent} from "./category/update/update.category.admin.component";
import {InsertCategoryAdminComponent} from "./category/insert/insert.category.admin.component";
import {UserAdminComponent} from "./user/user.admin.component";
import {InsertUserAdminComponent} from "./user/insert/insert.user.admin.component";
import {UpdateUserAdminComponent} from "./user/update/update.user.admin.component";
import {ProductImageAdminComponent} from "./product_image/product_image.admin.component";
import {InsertProductImageAdminComponent} from "./product_image/insert/insert.product_image.admin.component";
import { ArticleAdminComponent } from "./article/article.admin.component";
import { DashboardAdminComponent } from "./dashboard/dashboard.admin.component";
import { CommentAdminComponent } from "./comment/comment.admin.component";
import { UpdateCommentAdminComponent } from "./comment/update/update.comment.admin.component";
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatDialogModule } from '@angular/material/dialog';
import {MatInputModule } from '@angular/material/input';
import { DeleteConfirmationDialogComponent } from "./comment/delete/delete.confirm.dialog.component";
import { CouponAdminComponent } from "./coupon/coupon.admin.component";
import { UpdateCouponAdminComponent } from "./coupon/update/update.coupon.admin.component";
import { InsertCouponAdminComponent } from "./coupon/insert/insert.coupon.admin.component";
import { UpdateArticleAdminComponent } from "./article/update/update.article.admin.component";
import { UploadArticleAdminComponent } from "./article/upload/upload.article.component";
import { InsertArticleAdminComponent } from "./article/insert/insert.article.admin.component";
import { UploadCategoryAdminComponent } from "./category/upload/upload.category.component";
import { AddCouponAdminComponent } from "./coupon/addCoupon/add.coupon.admin.component";
import { OrderComponent } from "./chart/order/order.component";
import { RevenueComponent } from "./chart/revenue/revenue.component";
import { MatSelect } from "@angular/material/select";
import { MatOptionModule } from "@angular/material/core";

@NgModule({
  declarations: [
    AdminComponent,
    OrderAdminComponent,
    DetailOrderAdminComponent,
    ProductAdminComponent,
    CategoryAdminComponent,
    UpdateProductAdminComponent,
    InsertProductAdminComponent,
    UpdateCategoryAdminComponent,
    InsertCategoryAdminComponent,
    UploadCategoryAdminComponent,
    UserAdminComponent,
    InsertUserAdminComponent,
    UpdateUserAdminComponent,
    ProductImageAdminComponent,
    InsertProductImageAdminComponent, 
    ArticleAdminComponent,
    DashboardAdminComponent,
    CommentAdminComponent,
    UpdateCommentAdminComponent,
    DeleteConfirmationDialogComponent,
    CouponAdminComponent,
    UpdateCouponAdminComponent,
    InsertCouponAdminComponent,
    UpdateArticleAdminComponent,
    UploadArticleAdminComponent,
    InsertArticleAdminComponent,
    AddCouponAdminComponent
  ],
  imports: [
    AdminRoutingModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatDialogModule,
    MatInputModule,
    OrderComponent,
    RevenueComponent,
    MatSelect,
    MatOptionModule
]
})
export class AdminModule{}
