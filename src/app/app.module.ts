import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HomeComponent } from './components/home/home.component';
import { HeaderComponent } from "./components/header/header.component";
import { OrderComponent } from "./components/order/order.component";
import { LoginComponent } from "./components/login/login.component";
import { RegisterComponent } from "./components/register/register.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { TokenInterceptor } from "./interceptors/token.interceptor";
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app/app.component";
import { NgbPopover } from "@ng-bootstrap/ng-bootstrap";
import { UserProfileComponent } from "./components/user-profile/user.profile.component";
import { AdminModule } from "./components/admin/admin.module";
import { ProductListComponent } from "./components/product_list/product-list.component";
import { MatTabsModule } from '@angular/material/tabs';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ToastrModule } from "ngx-toastr";
import { FooterComponent } from './components/footer/footer.component';
import { DetailProductComponent } from './components/detail-product/detail-product.component';
import { ArticleComponent } from './components/article/article.component';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { PaymentComponent } from './components/payment/payment.component';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { ContactComponent } from './components/contact/contact.component';
import { PipesModule } from './pipes/pipes.module';
import { HeroComponent } from "./components/hero/hero.component";
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOptionModule } from '@angular/material/core';
import { PaymentSuccessComponent } from './components/payment-success/payment-success.component';
import { PaymentCheckoutComponent } from './components/payment-checkout/payment-checkout.component';
import { ChatBotComponent } from './components/chatbot/chatbot.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    DetailProductComponent,
    OrderComponent,
    LoginComponent,
    RegisterComponent,
    UserProfileComponent,
    ProductListComponent,
    ArticleComponent,
    PaymentComponent,
    PaymentSuccessComponent,
    PaymentCheckoutComponent,
    ChatBotComponent
  ],
  imports: [
    ReactiveFormsModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule,
    AppRoutingModule,
    NgbPopover,
    AdminModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    MatTabsModule,
    CommonModule,
    CarouselModule,
    PipesModule,
    HeaderComponent,
    ContactComponent,
    FooterComponent,
    HeroComponent,
    MatSelectModule,
    MatFormFieldModule,
    MatOptionModule
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: TokenInterceptor,
    multi: true,
  }, CurrencyPipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
