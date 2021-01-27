import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AdminLoginComponent } from './admin/components/admin-login/admin-login.component';
import { NavComponent } from './admin/components/nav/nav.component';
import { AdminPrincipalComponent } from './admin/components/admin-principal/admin-principal.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FooterComponent } from './admin/components/footer/footer.component';
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';
import { ClientsComponent } from './admin/components/clients/clients.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatIconModule } from '@angular/material/icon';
import { EditFormBookComponent } from './admin/components/edit-form-book/edit-form-book.component';
import { UserLoginComponent } from './user/components/user-login/user-login.component';
import { HomeComponent } from './user/components/home/home.component';
import { UserLayoutComponent } from './user-layout/user-layout.component';
import { HeaderComponent } from './user/components/header/header.component';
import { UserFooterComponent } from './user/components/user-footer/user-footer.component';
import { MaterialModule } from './material/material.module';
import { MainNavComponent } from './main-nav/main-nav.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { BooksListComponent } from './admin/components/books-list/books-list.component';
import { AddBookComponent } from './admin/components/add-book/add-book.component';
import { AuthorPanelComponent } from './admin/components/author-panel/author-panel.component';
import { CategoryPanelComponent } from './admin/components/category-panel/category-panel.component';
import { EditorialPanelComponent } from './admin/components/editorial-panel/editorial-panel.component';
import { BannerComponent } from './user/components/banner/banner.component';
import { OrderComponent } from './user/components/order/order.component';
import { PurchaseCompletedComponent } from './user/components/purchase-completed/purchase-completed.component';
// -------------INTERCEPTOR PARA EL TOKEN------------------------------------------------------
import { HTTP_INTERCEPTORS} from '@angular/common/http';
import { AuthInterceptorService } from './services/auth-interceptor.service';
import { UserSignupComponent } from './user/components/user-signup/user-signup.component';
import { UserPurchasesComponent } from './user/components/user-purchases/user-purchases.component';
import { OrderDetailComponent } from './user/components/order-detail/order-detail.component';
import { BookDetailComponent } from './user/components/book-detail/book-detail.component';
// abajo de todo en providers tambien se agregaron lineas de código
// ---------------------------------------------------------------------------------
// TOASTR PARA ALERTS
import { ToastrModule } from 'ngx-toastr';
// Este componente es el que se va a mostrar para el MatDialog de Angular Material
import { MatConfirmDialogComponent } from './mat-confirm-dialog/mat-confirm-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    AdminLoginComponent,
    NavComponent,
    AdminPrincipalComponent,
    FooterComponent,
    AdminLayoutComponent,
    ClientsComponent,
    EditFormBookComponent,
    UserLoginComponent,
    HomeComponent,
    UserLayoutComponent,
    HeaderComponent,
    UserFooterComponent,
    MainNavComponent,
    BooksListComponent,
    AddBookComponent,
    AuthorPanelComponent,
    CategoryPanelComponent,
    EditorialPanelComponent,
    BannerComponent,
    OrderComponent,
    PurchaseCompletedComponent,
    UserSignupComponent,
    UserPurchasesComponent,
    OrderDetailComponent,
    BookDetailComponent,
    MatConfirmDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    MatIconModule,
    NgbModule,
    MaterialModule,
    ReactiveFormsModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    ToastrModule.forRoot() // ToastrModule added,
  ],
  providers: [
    {
      // para el token
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true
    }
  ],
  bootstrap: [AppComponent],
  entryComponents: [MatConfirmDialogComponent] // para que cuando se llame a matDialog, muestre el componente mat-confirm-dialog.component
})
export class AppModule { }
