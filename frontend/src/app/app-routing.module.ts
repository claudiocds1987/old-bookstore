import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { AdminPrincipalComponent } from './admin/components/admin-principal/admin-principal.component';
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';
import { UserLayoutComponent } from './user-layout/user-layout.component';
import { ClientsComponent } from './admin/components/clients/clients.component';
import { BooksListComponent } from './admin/components/books-list/books-list.component';
import { AddBookComponent } from './admin/components/add-book/add-book.component';
import { EditFormBookComponent } from './admin/components/edit-form-book/edit-form-book.component';
import { AdminLoginComponent } from './admin/components/admin-login/admin-login.component';
import { HomeComponent } from './user/components/home/home.component';
// Guardianes
import { AdminGuard } from './admin.guard';

import { AuthorPanelComponent } from './admin/components/author-panel/author-panel.component';
import { CategoryPanelComponent } from './admin/components/category-panel/category-panel.component';
import { EditorialPanelComponent } from './admin/components/editorial-panel/editorial-panel.component';
import { OrderComponent } from './user/components/order/order.component';
import { PurchaseCompletedComponent } from './user/components/purchase-completed/purchase-completed.component';
import { UserLoginComponent } from './user/components/user-login/user-login.component';
import { UserSignupComponent } from './user/components/user-signup/user-signup.component';
import { UserPurchasesComponent } from './user/components/user-purchases/user-purchases.component';
import { OrderDetailComponent } from './user/components/order-detail/order-detail.component';
import { BookDetailComponent } from './user/components/book-detail/book-detail.component';

const routes: Routes = [
  {
    path: '',
    component: UserLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
      {
        path: 'home',
        component: HomeComponent
      },
      {
        path: 'signup',
        component: UserSignupComponent
      },
      {
        path: 'login',
        component: UserLoginComponent
      },
      {
        path: 'order',
        component: OrderComponent
      },
      {
        path: 'purchase-completed',
        component: PurchaseCompletedComponent
      },
      {
        path: 'user-purchases',
        component: UserPurchasesComponent
      },
      {
        path: 'order-detail/:idOrder',
        component: OrderDetailComponent
      },
      {
        path: 'book-detail/:idBook',
        component: BookDetailComponent
      }
    ]
  },
  {
    path: 'admin-login',
    component: AdminLoginComponent
  },
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'admin-principal',
        pathMatch: 'full',
      },
      {
        path: 'admin-principal',
        canActivate: [AdminGuard],
        component: AdminPrincipalComponent
      },
      {
        path: 'clientes',
        canActivate: [AdminGuard],
        component: ClientsComponent
      },
      {
        path: 'add-book',
        canActivate: [AdminGuard],
        component: AddBookComponent
      },
      {
        path: 'author-panel',
        canActivate: [AdminGuard],
        component: AuthorPanelComponent
      },
      {
        path: 'category-panel',
        canActivate: [AdminGuard],
        component: CategoryPanelComponent
      },
      {
        path: 'editorial-panel',
        canActivate: [AdminGuard],
        component: EditorialPanelComponent
      },
      {
        path: 'books-list',
        canActivate: [AdminGuard],
        component: BooksListComponent
      },
      {
        path: 'editar-libro/:id',
        canActivate: [AdminGuard],
        component: EditFormBookComponent
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
