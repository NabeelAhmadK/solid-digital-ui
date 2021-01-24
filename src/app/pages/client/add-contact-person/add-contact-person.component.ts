import { Component, OnInit, EventEmitter, Output } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { NzMessageService } from 'ng-zorro-antd/message'
import { UploadChangeParam } from 'ng-zorro-antd/upload'
import { ContactPerson, ContactPersonService } from 'src/app/services/contact-person'
import { DecimalPipe } from '@angular/common'
import { Router, ActivatedRoute } from '@angular/router'
import { ValidationService } from '../../../pages/advanced/validation'
import { environment } from 'src/environments/environment'

enum Methods {
  save = 'saveClient',
  update = 'updateClient'
}
@Component({
  selector: 'add-contact-person',
  templateUrl: './add-contact-person.component.html',
  styleUrls: ['./add-contact-person.component.scss'],
  providers: [ContactPersonService, DecimalPipe],
})
export class AddContactPersonComponent implements OnInit {


  submitted: boolean = false;
  clientId: any;
  contactPersonId: any;
  contactPersonForm: FormGroup
  accountForm: FormGroup
  url: any
  dummy_text: boolean = true;
  sub: any
  userAccounts: any

  constructor(
    private formBuilder: FormBuilder,
    private toast: NzMessageService,
    private contactPersonService: ContactPersonService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {
    this.activatedRoute.queryParams.subscribe(({ clientId }) => {
      if (clientId) this.clientId = clientId
    })

    this.activatedRoute.params.subscribe(({ contactPersonId }) => {
      if (contactPersonId) {
        this.contactPersonId = contactPersonId;
        this.getContactPersonbyId(this.contactPersonId);
      }
    })
  }


  ngOnInit() {

    this.contactPersonForm = this.formBuilder.group({
      user_account_id: [null],
      first_name: [null, Validators.required],
      last_name: [null, Validators.required],
      mobile_number: [null, [Validators.required, ValidationService.phoneValidator]],
      client_id: [null],
      email: [null, [Validators.required, ValidationService.emailValidator]],
      is_account_active: ['No'],
      send_email_invite: ['1'],
      profile_image: [null, Validators.required],
      profile_image_name: [null],
    })

    this.accountForm = this.formBuilder.group({
      name: [null, Validators.required],
      email: [null, Validators.required],
      password: ['soliddigital', Validators.required],
      c_password: ['soliddigital', Validators.required],
      profile_image: ['soliddigital', Validators.required],
    })

  }

  Submit(addOther: boolean = false): void {
    this.submitted = true;
    if (this.contactPersonForm.invalid) return

    this.contactPersonForm.get('client_id').setValue(this.clientId)
    let full_name = `${this.contactPersonForm.get('first_name').value} ${this.contactPersonForm.get('last_name').value
      }`
    let userEmail = this.contactPersonForm.get('email').value

    this.accountForm.get('name').setValue(full_name)
    this.accountForm.get('email').setValue(userEmail)

    this.contactPersonService.registerUserAccount(this.accountForm.value).subscribe(
      ({ data }) => {

        let user_account = data.user
        let user_account_id = user_account.id;

        if (user_account && user_account_id) {
          this.contactPersonForm.get('user_account_id').patchValue(user_account_id)
          this.addContactPerson(addOther);
        } else {
          this.toast.error('Error Adding Contact Person!')
        }
      },
      error => {
        this.toast.error('Error Adding Contact Person!')
        // this.errors = error.json().errors;
        // this.isLoading = false;
      },
    )
  }

  addContactPerson(addOther?: boolean) {
    this.contactPersonService.addContactPerson(this.contactPersonForm.value).subscribe(
      contact_person => {
        this.toast.success('Contact Person Added Successfully!')
        if (!addOther)
          this.router.navigate(['/pages/client-management/client', this.clientId]);
        else {
          this.accountForm.reset({
            password: 'soliddigital',
            c_password: 'soliddigital',
            profile_image: 'soliddigital',
          });
          this.contactPersonForm.reset({
            is_account_active: 'No',
            send_email_invite: '1',
          });
          this.submitted = false;
          this.url = null;
          this.dummy_text = true;
        }

      },
      error => {
        this.toast.error('Error Adding Contact Person!')
      },
    )
  }

  UpdateContactPerson() {
    this.submitted = true;
    if (this.contactPersonForm.invalid) return

    let payload = {
      name: this.userAccounts.name,
      email: this.userAccounts.email,
      roles: [2]
    }

    // if (this.contactPersonForm.get('profile_image').value)
    //   payload['profile_image'] = this.accountForm.get('profile_image').value

    this.contactPersonService
      .updateProfileImage(payload, this.contactPersonForm.get('user_account_id').value)
      .subscribe(res => {
        this.toast.success('Profile Image Updated Successfully')
      })

    this.contactPersonService
      .updateContactPerson(this.contactPersonForm.value, this.contactPersonId)
      .subscribe(
        contact_person => {
          this.toast.success('Contact Person Updated Successfully!')
          this.router.navigate(['/pages/client-management/client', this.clientId]);
        },
        error => {
          this.toast.error('Error Updating Contact Person!')
          // this.errors = error.json().errors;
          // this.isLoading = false;
        },
      )
  }


  getContactPersonbyId(contactPersonId: any) {
    this.contactPersonService.getContactPerson(contactPersonId).subscribe(
      ({ data }) => {
        this.Populate(data)
        this.getUserbyID(data.user_account_id)
      },
      error => { },
    )
  }

  getUserbyID(id) {
    this.contactPersonService.getUserbyId(id).subscribe(({ data }) => {
      if (data.profile_image) {
        this.url = environment.baseUrl + data.profile_image.url
        this.contactPersonForm.get('profile_image').setValidators(null);
        this.contactPersonForm.get('profile_image').updateValueAndValidity();


      }
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

  handleChange(event) {
    if (!event.target.files[0] || event.target.files[0].length == 0) {
      this.toast.error('You must select an image')
      return
    }
    var mimeType = event.target.files[0].type

    if (mimeType.match(/image\/*/) == null) {
      this.toast.error('Only images are supported')
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
          this.toast.success('Profile Image Uploaded SuccessFully')
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
}
