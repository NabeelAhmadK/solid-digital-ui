import { Component, OnInit, EventEmitter, Output } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { NzMessageService } from 'ng-zorro-antd/message'
import { UploadChangeParam } from 'ng-zorro-antd/upload'
import { ContactPerson, ContactPersonService } from 'src/app/services/contact-person'
import { DecimalPipe } from '@angular/common'
import { Router, ActivatedRoute } from '@angular/router'

@Component({
  selector: 'edit-contact-person-form',
  templateUrl: './edit-contact-person-form.component.html',
  styleUrls: ['./edit-contact-person-form.component.scss'],
  providers: [ContactPersonService, DecimalPipe],
})
export class EditContactPersonFormComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private msg: NzMessageService,
    private contactPersonService: ContactPersonService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {}

  contactPersonForm: FormGroup
  url
  contact_person_id
  sub
  contact_person: ContactPerson

  dummy_text: boolean = true

  // submitForm1(): void {
  //   for (const i in this.validateForm1.controls) {
  //     if (this.validateForm1.controls.hasOwnProperty(i)) {
  //       this.validateForm1.controls[i].markAsDirty()
  //       this.validateForm1.controls[i].updateValueAndValidity()
  //     }
  //   }
  // }

  // submitForm2(): void {
  //   for (const i in this.validateForm2.controls) {
  //     if (this.validateForm2.controls.hasOwnProperty(i)) {
  //       this.validateForm2.controls[i].markAsDirty()
  //       this.validateForm2.controls[i].updateValueAndValidity()
  //     }
  //   }
  // }

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
    formData1.append('client_id', this.contact_person_id)
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
      this.contact_person_id = params.get('id')

      this.contactPersonService.getContactPerson(this.contact_person_id).subscribe(
        contact_person => {
          this.contact_person = contact_person.data

          console.log('Contact Person: ', this.contact_person)

          this.contactPersonForm = this.fb.group({
            first_name: [this.contact_person.first_name, Validators.required],
            last_name: [this.contact_person.last_name, Validators.required],
            mobile_number: [this.contact_person.mobile_number, Validators.required],
            email: [this.contact_person.email, Validators.required],
            is_account_active: [this.contact_person.is_account_active, Validators.required],
            send_email_invite: [this.contact_person.send_email_invite, Validators.required],
            profile_image: ['', Validators.required],
            profile_image_name: ['', Validators.required],
          })
          this.url = 'http://localhost:8000' + this.contact_person.user_account.profile_image['url']
          this.dummy_text = false
        },
        error => {
          console.log(error)
          // this.errors = error.json().errors;
          // this.isLoading = false;
        },
      )
    })
  }
}
