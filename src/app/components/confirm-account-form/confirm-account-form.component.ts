import { Component } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Store } from '@ngrx/store'

@Component({
  selector: 'confirm-account-form',
  templateUrl: './confirm-account-form.component.html',
})
export class ConfirmAccountFormComponent {
  form: FormGroup
  logo: String
  loading: boolean = false

  constructor(private fb: FormBuilder, private store: Store<any>) {
    this.form = fb.group({
      password: ['demo123', [Validators.required, Validators.minLength(4)]],
      confirm_password: ['demo123', [Validators.required]],
    })
  }
}
