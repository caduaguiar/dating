import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { error } from 'selenium-webdriver';
import { AlertifyService } from '../_services/alertify.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  model: any = {};
  @Input() valuesFromHome: any;
  @Output() cancelRegistered = new EventEmitter();

  constructor(private authService: AuthService, private alertigy: AlertifyService) { }

  ngOnInit() {
  }

  register() {
    this.authService.register(this.model).subscribe(() => {
      this.alertigy.success('registrations sucessfull');
    // tslint:disable-next-line:no-shadowed-variable
    }, error => {
      this.alertigy.error(error);
    });
  }

  cancel() {
    this.cancelRegistered.emit(false);
  }

}
