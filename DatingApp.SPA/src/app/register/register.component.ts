import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { error } from 'selenium-webdriver';
import { AlertifyService } from '../_services/alertify.service';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker/bs-datepicker.config';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  @Output() cancelRegistered = new EventEmitter();
  model: any = {};
  registerForm: FormGroup
  bsConfig: Partial<BsDatepickerConfig>;

  constructor(
    private authService: AuthService,
    private alertigy: AlertifyService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.bsConfig = {
      containerClass: 'theme-red'
    }
    this.createRegisterForm();
  }

  createRegisterForm() {
    this.registerForm = this.fb.group({
      gender: ['male'],
      username: ['', Validators.required],
      knownAs: ['', Validators.required],
      dateOfBirth: [null, Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      password: ['', Validators.required, Validators.minLength(4), Validators.maxLength(8)],
      confirmPassword: ['', Validators.required]
    }, { validator: this.passwordMathValidator });
  }

  passwordMathValidator(p: FormGroup) {
    return p.get('password').value === p.get('confirmPassword').value ? null : { 'mismatch': true };
  }

  register() {
    // this.authService.register(this.model).subscribe(() => {
    //   this.alertigy.success('registrations sucessfull');
    // // tslint:disable-next-line:no-shadowed-variable
    // }, error => {
    //   this.alertigy.error(error);
    // });
    console.log(this.registerForm.value)
  }

  cancel() {
    this.cancelRegistered.emit(false);
  }

}
