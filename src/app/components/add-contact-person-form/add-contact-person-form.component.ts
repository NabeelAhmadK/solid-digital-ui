import { Component, OnInit, EventEmitter, Output } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { NzMessageService } from 'ng-zorro-antd/message'
import { UploadChangeParam } from 'ng-zorro-antd/upload'
import { ContactPerson, ContactPersonService } from 'src/app/services/contact-person'
import { DecimalPipe } from '@angular/common'
import { Router, ActivatedRoute } from '@angular/router'

@Component({
  selector: 'add-contact-person-form',
  templateUrl: './add-contact-person-form.component.html',
  styleUrls: ['./add-contact-person-form.component.scss'],
  providers: [ContactPersonService, DecimalPipe],
})
export class AddContactPersonFormComponent implements OnInit {
  contactPersonForm: FormGroup
  accountForm: FormGroup
  url: any
  client_id: any
  sub: any

  constructor(
    private fb: FormBuilder,
    private msg: NzMessageService,
    private contactPersonService: ContactPersonService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {
    this.activatedRoute.params.subscribe(({ id }) => {
      if (id) this.client_id = id
    })
  }

  @Output()
  contactPersonAdded: EventEmitter<ContactPerson> = new EventEmitter<ContactPerson>()

  validateForm1: FormGroup
  validateForm2: FormGroup
  dummy_text: boolean = true

  submitForm1(): void {
    for (const i in this.validateForm1.controls) {
      if (this.validateForm1.controls.hasOwnProperty(i)) {
        this.validateForm1.controls[i].markAsDirty()
        this.validateForm1.controls[i].updateValueAndValidity()
      }
    }
  }

  submitForm2(): void {
    for (const i in this.validateForm2.controls) {
      if (this.validateForm2.controls.hasOwnProperty(i)) {
        this.validateForm2.controls[i].markAsDirty()
        this.validateForm2.controls[i].updateValueAndValidity()
      }
    }
  }

  handleChange(event) {
    if (!event.target.files[0] || event.target.files[0].length == 0) {
      this.msg.error('You must select an image')
      return
    }

    var mimeType = event.target.files[0].type

    if (mimeType.match(/image\/*/) == null) {
      this.msg.error('Only images are supported')
      return
    }

    const [file] = event.target.files

    var reader = new FileReader()
    reader.readAsDataURL(file)

    reader.onload = () => {
      this.url = reader.result as string

      this.dummy_text = false

      const file_formData = new FormData()
      file_formData.append('file', file)

      this.contactPersonService.uploadProfileImage(file_formData).subscribe(
        profile_image => {
          this.msg.success('Profile Image Uploaded SuccessFully')
          this.accountForm.patchValue({
            profile_image: profile_image['name'],
          })
        },
        error => {
          // this.errors = error.json().errors;
          // this.isLoading = false;
        },
      )
    }
  }

  SaveandAddOther() {
    this.contactPersonForm.get('client_id').setValue(this.client_id)
    let full_name = `${this.contactPersonForm.get('first_name').value} ${
      this.contactPersonForm.get('last_name').value
    }`
    let userEmail = this.contactPersonForm.get('email').value
    let password = 'soliddigital'

    this.accountForm.get('name').setValue(full_name)
    this.accountForm.get('email').setValue(userEmail)

    this.contactPersonService.registerUserAccount(this.accountForm.value).subscribe(
      user_account_res => {
        let user_account = user_account_res.data.user
        let user_account_id = user_account['id']

        if (user_account && user_account_id) {
          this.contactPersonForm.get('user_account_id').patchValue(user_account_id)

          this.contactPersonForm
            .get('profile_image')
            .patchValue(this.contactPersonForm.get('profile_image_name').value)

          this.contactPersonService.addContactPerson(this.contactPersonForm.value).subscribe(
            contact_person => {
              this.msg.success('Contact Person Added Successfully!')
              this.accountForm.reset({
                password: 'soliddigital',
                c_password: 'soliddigital',
              })
              this.contactPersonForm.reset({
                is_account_active: 'No',
                send_email_invite: '1',
              })
            },
            error => {
              this.msg.error('Error Adding Contact Person!')
            },
          )
        } else {
          this.msg.error('Error Adding Contact Person!')
        }
      },
      error => {
        this.msg.error('Error Adding Contact Person!')
        // this.errors = error.json().errors;
        // this.isLoading = false;
      },
    )
  }

  saveContactPerson(): void {
    this.contactPersonForm.get('client_id').setValue(this.client_id)
    let full_name = `${this.contactPersonForm.get('first_name').value} ${
      this.contactPersonForm.get('last_name').value
    }`
    let userEmail = this.contactPersonForm.get('email').value
    let password = 'soliddigital'

    this.accountForm.get('name').setValue(full_name)
    this.accountForm.get('email').setValue(userEmail)

    this.contactPersonService.registerUserAccount(this.accountForm.value).subscribe(
      user_account_res => {
        let user_account = user_account_res.data.user
        let user_account_id = user_account['id']

        if (user_account && user_account_id) {
          this.contactPersonForm.get('user_account_id').patchValue(user_account_id)

          this.contactPersonService.addContactPerson(this.contactPersonForm.value).subscribe(
            contact_person => {
              this.msg.success('Contact Person Added Successfully!')
              this.router.navigate(['/client/client_overview'])
            },
            error => {
              this.msg.error('Error Adding Contact Person!')
            },
          )
        } else {
          this.msg.error('Error Adding Contact Person!')
        }
      },
      error => {
        this.msg.error('Error Adding Contact Person!')
        // this.errors = error.json().errors;
        // this.isLoading = false;
      },
    )
  }

  ngOnInit(): void {
    this.contactPersonForm = this.fb.group({
      user_account_id: [null],
      first_name: [null, Validators.required],
      last_name: [null, Validators.required],
      mobile_number: [null, Validators.required],
      client_id: [null, Validators.required],
      email: [null, Validators.required],
      is_account_active: ['No', Validators.required],
      send_email_invite: ['1', Validators.required],
      profile_image: [null],
      profile_image_name: [null],
    })

    this.accountForm = this.fb.group({
      name: [null, Validators.required],
      email: [null, Validators.required],
      password: ['soliddigital', Validators.required],
      c_password: ['soliddigital', Validators.required],
      profile_image: ['soliddigital', Validators.required],
    })
  }
}
