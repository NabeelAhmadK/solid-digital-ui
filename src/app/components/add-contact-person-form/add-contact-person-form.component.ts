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
  constructor(
    private fb: FormBuilder,
    private msg: NzMessageService,
    private contactPersonService: ContactPersonService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {}
  contactPersonForm: FormGroup
  url
  client_id
  sub

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

      console.log(this.url)
      this.dummy_text = false

      const file_formData = new FormData()
      file_formData.append('file', file)

      this.contactPersonService.uploadProfileImage(file_formData).subscribe(
        profile_image => {
          this.msg.success('Profile Image Uploaded SuccessFully')
          console.log(profile_image['name'])
          this.contactPersonForm.patchValue({
            profile_image_name: profile_image['name'],
          })
        },
        error => {
          // this.errors = error.json().errors;
          // this.isLoading = false;
        },
      )
    }
  }

  saveContactPerson(): void {
    const formData1 = new FormData()
    const formData2 = new FormData()

    formData1.append('first_name', this.contactPersonForm.value.first_name)
    formData1.append('last_name', this.contactPersonForm.value.last_name)
    formData1.append('mobile_number', this.contactPersonForm.value.mobile_number)
    formData1.append('email', this.contactPersonForm.value.email)
    formData1.append('client_id', this.client_id)
    formData1.append('send_email_invite', this.contactPersonForm.value.send_email_invite)
    formData1.append('is_account_active', this.contactPersonForm.value.is_account_active)
    formData1.append('profile_image', this.contactPersonForm.value.profile_image_name)

    let full_name =
      this.contactPersonForm.value.first_name + ' ' + this.contactPersonForm.value.last_name
    let user_name = this.contactPersonForm.value.email
    let password = 'soliddigital'

    formData2.append('name', full_name)
    formData2.append('email', user_name)
    formData2.append('password', password)
    formData2.append('c_password', password)

    this.contactPersonService.registerUserAccount(formData2).subscribe(
      user_account_res => {
        let user_account = user_account_res.data.user
        let user_account_id = user_account['id']

        if (user_account && user_account_id) {
          formData1.append('user_account_id', user_account_id)

          this.contactPersonService.addContactPerson(formData1).subscribe(
            contact_person => {
              this.msg.success('Contact Person Added Successfully!')
              this.router.navigate(['/'])
            },
            error => {
              this.msg.error('Error Adding Contact Person!')
              // this.errors = error.json().errors;
              // this.isLoading = false;
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
    this.sub = this.activatedRoute.paramMap.subscribe(params => {
      this.client_id = params.get('id')

      this.contactPersonForm = this.fb.group({
        first_name: ['', Validators.required],
        last_name: ['', Validators.required],
        mobile_number: ['', Validators.required],
        email: ['', Validators.required],
        is_account_active: ['No', Validators.required],
        send_email_invite: ['1', Validators.required],
        profile_image: ['', Validators.required],
        profile_image_name: ['', Validators.required],
      })
    })
  }
}
