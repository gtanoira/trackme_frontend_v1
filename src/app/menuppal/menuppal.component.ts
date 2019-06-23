import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';

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
    stagger: 80,
    transitionDuration: '0.8s'
  };
  // Instantiate the isotope class
  public isotope: any;

  constructor (
    private authorizationService: AuthorizationService,
    private errorMessageService: ErrorMessageService,
    private router: Router
  ) {}

  ngOnInit() {

    // Create the user menu
    this.authorizationService.createUsermenu()
      .subscribe(
        data => {
          this.bricks = data;

          // Create the group programs array
          this.bricks.forEach(mnuButton => {
            // Check if the group exists
            let groupExists = false;
            for (const group of this.mnuGroups) {
              if (group.name === mnuButton.pgmGroup) {
                groupExists = true;
                break;
              }
            }
            if (groupExists === false) {
              this.mnuGroups.push({
                name: mnuButton.pgmGroup,
                color: mnuButton.color
              });
            }
          });
        },
        err => {
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

  // Filter menu buttons by GROUP PROGRAM
  onFilter(group) {
    this.isotope.arrange({
      // item element provided as argument
      filter: (group === 'all') ? '*' : `.${group}`
    });
    this.isotope.arrange();
  }
}
