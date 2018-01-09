import { Component, OnInit } from '@angular/core';
import { User } from '../../_models/User';
import { ActivatedRoute } from '@angular/router';
import { AlertifyService } from '../../_services/alertify.service';
import { ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.css']
})
export class MemberEditComponent implements OnInit {

  user: User;
  @ViewChild('editForm') editForm: NgForm

  constructor(private route: ActivatedRoute, private alertify: AlertifyService) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.user = data['user']
    });
  }

  updateUser() {
    console.log(this.user);
    this.editForm.reset(this.user);
  }

}
