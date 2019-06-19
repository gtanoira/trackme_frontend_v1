﻿import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

// Services
import { AuthenticationService } from '../../shared/authentication.service';
import { ErrorMessageService } from '../../shared/error-message.service';

@Component({
  templateUrl: 'login.component.html',
  styleUrls: ['./login.component.css'],
  host: {
    class: 'full-width'
  }
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  returnUrl: string;
  error  = '';

  constructor(
    private route: ActivatedRoute,
    private authenticationService: AuthenticationService,
    private errorMessageService: ErrorMessageService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    // redirect to home if already logged in
    if (this.authenticationService.currentUserValue) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  // GETTERS:convenience getter for easy access to form fields
  get lfctrls() { return this.loginForm.controls; }

  onSubmit() {

    // Borrar la linea de errores
    this.errorMessageService.changeErrorMessage('');

    // Chequear que el FORM sea válido
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;  // spinning ON
    // Autenticar al usuario contra el Login Central
    this.authenticationService.login(this.lfctrls.username.value, this.lfctrls.password.value)
      .subscribe(
        data => {
          this.router.navigate([this.returnUrl]);
        },
        error => {
          this.errorMessageService.changeErrorMessage(error);
          this.loading = false;
          this.router.navigate(['/login']);
        });
  }
}
