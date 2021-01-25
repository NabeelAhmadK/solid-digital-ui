import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { ValidationService } from '../../../../pages/advanced/validation'
import { jwtAuthService } from '../../../../services/jwt'
import { NzMessageService } from 'ng-zorro-antd/message'
import { Router } from '@angular/router'

@Component({
  selector: 'cui-system-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['../style.component.scss'],
})
export class ForgotPasswordComponent implements OnInit {
  submitted: boolean = false;
  forgotPasswordForm: FormGroup
  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private toast: NzMessageService,
    private authService: jwtAuthService) { }

  ngOnInit(): void {
    this.forgotPasswordForm = this.formBuilder.group({
      email: [null, [Validators.required, ValidationService.emailValidator]],
    })
  }

  ResetPassword() {
    this.submitted = true;
    if (this.forgotPasswordForm.invalid) return;

    this.authService.forgotPassword(this.forgotPasswordForm.value)
      .subscribe(({ msg }) => {
        this.toast.success(msg)
        this.router.navigate(['/auth/login'], { replaceUrl: true })
      }, err => {
        this.toast.error(err.error.message)
      })
  }
}
