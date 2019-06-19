import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

// Models
// import { IsotopeOptions } from './isotope-options';

// Servicios
import { AuthorizationService } from '../../shared/authorization.service';
import { ErrorMessageService } from '../../shared/error-message.service';

// Librerias
import * as Isotope from 'isotope-layout';

@Component({
  selector: 'app-main',
  templateUrl: './menuppal.component.html',
  styleUrls: ['./menuppal.component.css']
})
export class MenuppalComponent implements OnInit, AfterViewInit {

  // Contenido de las opciones de Menú
  /*
  bricks = [
    {
      title: 'Cotizaciones SAP',
      alias: 'AdCs',
      group: 'Administración',
      id: 'pgmCotizaciones',
      color: 'blue'
    },
    { ... }
  ]
  */
  bricks = [];

  // Filtro para el menu basado en los Grupos
  mnuGroups = [
    {
      name: 'all',
      color: 'black'
    }
  ];

  // Opciones para configurar el Menu via IsotopeOptions
  private isotopeOptions: Isotope.IsotopeOptions = {
    itemSelector: '.grid-item',
    layoutMode: 'fitRows',
    stagger: 30,
    transitionDuration: '0.8s'
  };
  // Instanciar la clase Isotope
  public isotope: any;

  constructor (
    private authorizationService: AuthorizationService,
    private errorMessageService: ErrorMessageService,
    private router: Router
  ) {}

  ngOnInit() {

    // Armar el menu para el usuario
    this.authorizationService.createUsermenu()
      .subscribe(
        data => {
          this.bricks = data;

          // Armar el array de Grupos
          this.bricks.forEach(mnuButton => {
            // Determinar si el grupo ya existe
            let groupExists = false;
            for (const group of this.mnuGroups) {
              if (group.name === mnuButton.group) {
                groupExists = true;
                break;
              }
            }
            if (groupExists === false) {
              this.mnuGroups.push({
                name: mnuButton.group,
                color: mnuButton.color
              });
            }
          });
        },
        err => {
          console.log('*** ERROR 4', err);
          this.errorMessageService.changeErrorMessage(err);
        }
      );
  }

  ngAfterViewInit() {
    // Setear los colores de los botones en base al grupo
    // Definir un componente Isotope
    this.isotope = new Isotope('.grid', this.isotopeOptions);
  }

  runProgram(pgmId: string) {
    this.router.navigate([`/${pgmId}`]);
  }

  // Filtrar los menúes por GrupoId
  onFilter(group) {
    this.isotope.arrange({
      // item element provided as argument
      filter: (group === 'all') ? '*' : `.${group}`
    });
    this.isotope.arrange();
  }
}
