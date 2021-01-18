import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { ValidationService } from '../../../../pages/advanced/validation'
// import { }
@Component({
  selector: 'cui-system-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['../style.component.scss'],
})
export class ForgotPasswordComponent implements OnInit {
  forgotPasswordForm: FormGroup
  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.forgotPasswordForm = this.formBuilder.group({
      email: [null, [Validators.required, ValidationService.emailValidator]],
    })
  }

  Submit() {}
}
