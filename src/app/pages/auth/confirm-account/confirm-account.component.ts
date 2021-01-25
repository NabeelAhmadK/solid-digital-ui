import { Component, OnInit } from '@angular/core'
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { ValidationService } from '../../advanced/validation'
import { jwtAuthService } from '../../../services/jwt'
import { NzMessageService } from 'ng-zorro-antd/message'

@Component({
  selector: 'app-confirm-account',
  templateUrl: './confirm-account.component.html',
  styleUrls: ['./confirm-account.component.scss']
})
export class ConfirmAccountComponent implements OnInit {

  confirmAccountFrom: FormGroup
  token: any;
  submitted: boolean = false;
  email: any;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: jwtAuthService,
    private toast: NzMessageService) {
    this.route.params.subscribe(({ token, email }) => {
      if (token) {
        this.token = token
      }
      if(email) {
        this.email = email
      }
    })
  }

  ngOnInit() {
    this.confirmAccountFrom = this.formBuilder.group({
      password: [null, [Validators.required, Validators.minLength(6)]],
      c_password: [null, [Validators.required]],
      email: [null],
      token: [null]
    }, {
      validators: ValidationService.matchValidator('password', 'c_password')
    })
  }

  Submit() {
    this.submitted = true;
    if (this.confirmAccountFrom.invalid) return;

    this.confirmAccountFrom.get('token').setValue(this.token);
    this.confirmAccountFrom.get('email').setValue(this.email);

    let result = this.confirmAccountFrom.value;
    delete result.c_password;

    this.authService.confirmAccount(result)
      .subscribe(res => {
        this.toast.success('Account has been Confirmed Successfully');
        this.router.navigate(['/auth/login'], { replaceUrl: true })
      }, err => {
        this.toast.error(err.error.message)
      })

  }
}
