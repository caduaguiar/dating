import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { error } from 'selenium-webdriver';
import { AlertifyService } from '../_services/alertify.service';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { User } from '../_models/User';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  user: User;
  @Input() valuesFromHome: any;
  @Output() cancelRegistered = new EventEmitter();
  registerForm: FormGroup;

  constructor(
    private authService: AuthService,
    private alertigy: AlertifyService,
    private fb: FormBuilder,
    private router: Router
  ) { }

  ngOnInit() {
    this.createRegisterForm();
  }

  createRegisterForm() {
    this.registerForm = this.fb.group({
      gender:['male'],
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

    if (this.registerForm.valid) {
      this.user = Object.assign({}, this.registerForm.value);
      this.authService.register(this.user).subscribe(() => {
        this.alertigy.success('registrations sucessfull');
      }, error => {
          this.alertigy.error(error);
        }, () => {
          this.authService.login(this.user).subscribe(() => {
            this.router.navigate(['/members'])
          });
        });
    }
  }

  cancel() {
    this.cancelRegistered.emit(false);
  }

}
