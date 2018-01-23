import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { error } from 'selenium-webdriver';
import { AlertifyService } from '../_services/alertify.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  model: any = {};
  @Input() valuesFromHome: any;
  @Output() cancelRegistered = new EventEmitter();
  registerForm: FormGroup

  constructor(private authService: AuthService, private alertigy: AlertifyService) { }

  ngOnInit() {
    this.registerForm = new FormGroup({
      username: new FormControl('', Validators.required),
      password: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(8)]),
      confirmPassword: new FormControl('', Validators.required)
    }, this.passwordMathValidator);
  }

  passwordMathValidator(p: FormGroup){
    return p.get('password').value === p.get('confirmPassword').value ? null : {'mismatch': true};
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
