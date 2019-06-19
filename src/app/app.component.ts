/*
  Este componente es el principal del sistema y muestra la página ppal del portal y el
  esquema de menúes
*/
import { Component, ElementRef, AfterViewInit, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material';
import { MatIconRegistry } from '@angular/material/icon';

// Services
import { ErrorMessageService } from '../shared/error-message.service';
import { AuthenticationService } from '../shared/authentication.service';

// Environment
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {

  formErrorMessage: string;
  // Toolbar variables
  toolbarUser   = '';
  toolbarSapGw  = '';
  toolbarLogin  = '';
  toolbarPortal = '';

  constructor(
    public authenticationService: AuthenticationService,
    private domSanitizer: DomSanitizer,
    private errorMessageService: ErrorMessageService,
    private elementRef: ElementRef,
    private matIconRegistry: MatIconRegistry
  ) {

    // Definir iconos
    // Logout
    this.matIconRegistry.addSvgIcon(
      'logout',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/images/logout.svg')
    );
    // EnvironmentInfo
    this.matIconRegistry.addSvgIcon(
      'env_info',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/images/information.svg')
    );
    // Home
    this.matIconRegistry.addSvgIcon(
      'home_main',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/images/home_main.svg')
    );
    // User
    this.matIconRegistry.addSvgIcon(
      'user_toolbar',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/images/avatar.svg')
    );

    // Subscribir a los errores del módulo, para que sean mostrados en la pantalla
    this.errorMessageService.formCurrentMessage
      .subscribe(
        message => this.formErrorMessage = message
      );

    // Subscibir el Toolbar user
    this.authenticationService.currentUser
      .subscribe(
        user => this.toolbarUser = (user) ? user.fullName : ''
      );

  }

  ngOnInit() {
    // Borrar posible mensaje de error
    this.errorMessageService.changeErrorMessage(null);
    // Toolbar
    this.toolbarLogin  = environment.envData.loginServer;
    this.toolbarPortal = environment.envData.portal;
  }

}
