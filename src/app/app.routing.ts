import { Routes, RouterModule } from '@angular/router';

// Importar componentes
import { LoginComponent } from './login/login.component';
import { CustomerOrdersGridComponent } from './customer_orders/customer_orders_grid.component';
import { MenuppalComponent } from './menuppal/menuppal.component';
import { AuthGuard } from './_guards';

const appRoutes: Routes = [
 {
    path: 'pgmClientOrders',
    component: CustomerOrdersGridComponent,
    canActivate: [AuthGuard],
    data: {
      idProgram:   'pgmClientOrders',
      nameProgram: 'Client Orders Grid'
    }
  },
  {
    path: '',
    component: MenuppalComponent,
    canActivate: [AuthGuard],
    data: {
      idProgram:   'homePage',
      nameProgram: 'Menú Principal - Home Page'
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
