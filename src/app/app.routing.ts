import { Routes, RouterModule } from '@angular/router';

// Importar componentes
import { LoginComponent } from './login/login.component';
import { MenuppalComponent } from './menuppal/menuppal.component';
import { AuthGuard } from './_guards';

const appRoutes: Routes = [
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
