import { Routes, RouterModule } from '@angular/router';

// Importar componentes
import { LoginComponent } from './login/login.component';
import { CustomerOrderTabsComponent } from './customer_orders/customer_order_tabs.component';
import { MenuppalComponent } from './menuppal/menuppal.component';
import { AuthGuard } from './_guards';

const appRoutes: Routes = [
 {
    path: 'pgmClientOrders',
    component: CustomerOrderTabsComponent,
    canActivate: [AuthGuard],
    data: {
      idProgram:   'pgmClientOrders',
      nameProgram: 'Customer Orders'
    }
  },
  {
    path: '',
    component: MenuppalComponent,
    canActivate: [AuthGuard],
    data: {
      idProgram:   'homePage',
      nameProgram: 'Home Page'
    }
  },
  {
    path: 'login',
    component: LoginComponent
  },
  // otherwise redirect to Lgin
  { path: '**', redirectTo: 'login' }
];

export const routing = RouterModule.forRoot(appRoutes);
