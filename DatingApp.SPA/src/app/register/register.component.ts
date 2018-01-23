import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { error } from 'selenium-webdriver';
import { AlertifyService } from '../_services/alertify.service';
import { FormGroup, FormControl } from '@angular/forms/src/model';

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
      usersanem: new FormControl(),
      password: new FormControl(),
      confirmPassword: new FormControl()
    })
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
