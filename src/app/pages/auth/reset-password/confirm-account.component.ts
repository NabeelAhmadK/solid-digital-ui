import { Component, OnInit } from '@angular/core'
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { ValidationService } from '../../advanced/validation'
import { jwtAuthService } from '../../../services/jwt'
import { NzMessageService } from 'ng-zorro-antd/message'

@Component({
  selector: 'reset-account',
  templateUrl: './confirm-account.component.html',
  styleUrls: ['./confirm-account.component.scss'],
})
export class ResetPasswordComponent implements OnInit {

  token: any;
  userEmail: any;
  submitted: boolean = false;
  resetPasswordForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: jwtAuthService,
    private toast: NzMessageService
  ) {
    this.route.params.subscribe(({ token, email }) => {
      if (token) {
        this.token = token
      }
      if (email) {
        this.userEmail = email
      }
    })

  }

  ngOnInit() {
    this.resetPasswordForm = this.formBuilder.group({
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
    if (this.resetPasswordForm.invalid) return;

    this.resetPasswordForm.get('token').setValue(this.token);
    this.resetPasswordForm.get('email').setValue(this.userEmail);

    let result = this.resetPasswordForm.value;
    delete result.c_password;

    this.authService.resetPassword(result)
      .subscribe(res => {
        this.toast.success('Password has been successfully reset');
        this.router.navigate(['/auth/login'], { replaceUrl: true })
      }, err => {
        this.toast.error(err.error.message)
      })

  }
}
