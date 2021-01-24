import { Component, OnInit, EventEmitter, Output } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { NzMessageService } from 'ng-zorro-antd/message'
import { UploadChangeParam } from 'ng-zorro-antd/upload'
import { ContactPerson, ContactPersonService } from 'src/app/services/contact-person'
import { DecimalPipe } from '@angular/common'
import { Router, ActivatedRoute } from '@angular/router'
import { environment } from 'src/environments/environment'

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
  ) {
    this.activatedRoute.params.subscribe(({ id }) => {
      if (id) {
        this.contactPersonId = id
        this.getContactPersonbyId(id)
      }
    })
  }
  contactPersonForm: FormGroup
  userAccounts: any
  contactPersonId: any
  profileImage: any
  url
  contact_person_id
  sub
  contact_person: ContactPerson

  dummy_text: boolean = true

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
          this.profileImage = profile_image['name']
        },
        error => { },
      )
    }
  }

  saveContactPerson(): void {
    let payload = {
      profile_image: this.profileImage,
      name: this.userAccounts.name,
      email: this.userAccounts.email,
      roles: [2],
    }
    this.contactPersonService
      .updateProfileImage(payload, this.contactPersonForm.get('user_account_id').value)
      .subscribe(res => {
        this.msg.success('Profile Image Updated Successfully')
      })

    this.contactPersonService
      .updateContactPerson(this.contactPersonForm.value, this.contactPersonId)
      .subscribe(
        contact_person => {
          this.msg.success('Contact Person Updated Successfully!')
          this.router.navigate(['/pages/client-management/clients'])
        },
        error => {
          this.msg.error('Error Updating Contact Person!')
          // this.errors = error.json().errors;
          // this.isLoading = false;
        },
      )
  }

  ngOnInit(): void {
    this.contactPersonForm = this.fb.group({
      first_name: [null, Validators.required],
      last_name: [null, Validators.required],
      mobile_number: [null, Validators.required],
      client_id: [null, Validators.required],
      email: [null, Validators.required],
      is_account_active: [null, Validators.required],
      user_account_id: [null, Validators.required],
      send_email_invite: [null, Validators.required],
      profile_image: [null, Validators.required],
      profile_image_name: [null, Validators.required],
    })
  }

  getContactPersonbyId(id: any) {
    this.contactPersonService.getContactPerson(id).subscribe(
      ({ data }) => {
        this.Populate(data)
        this.getUserbyID(data.user_account_id)
      },
      error => { },
    )
  }

  getUserbyID(id) {
    this.contactPersonService.getUserbyId(id).subscribe(({ data }) => {
      if (data.profile_image) this.url = data.profile_image.url
      if (data.profile_image && data.profile_image.url) this.dummy_text = false

      this.userAccounts = data
    })
  }

  Populate(contactPerson) {
    Object.keys(contactPerson).forEach(k => {
      let control = <FormGroup>this.contactPersonForm.get(k)
      if (control) {
        control.patchValue(contactPerson[k], { onlySelf: false })
      }
    })
  }
}
