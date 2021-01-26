import { Component, OnInit, EventEmitter, Output } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { NzMessageService } from 'ng-zorro-antd/message'
import { UploadChangeParam } from 'ng-zorro-antd/upload'
import { Client, ClientService } from 'src/app/services/client'
import { DecimalPipe } from '@angular/common'
import { ValidationService } from '../../../pages/advanced/validation'
import { Router, ActivatedRoute } from '@angular/router'
import { ContactPerson, ContactPersonService } from '../../../services/contact-person'
import { environment } from 'src/environments/environment'
enum Methods {
  save = 'saveClient',
  update = 'updateClient'
}
@Component({
  selector: 'add-client',
  templateUrl: './add-client.component.html',
  styleUrls: ['./add-client.component.scss'],
  providers: [ContactPersonService, ClientService, DecimalPipe]
})
export class AddClientComponent implements OnInit {

  page: any = 1
  pageSize: any = 5
  clientId: any;
  contactPersons: Array<any> = []
  method: any;
  clientForm: FormGroup;
  dummy_text: boolean = true;
  showLoading: boolean = false;
  showLoadingContactPerson: boolean = false;
  submitted: boolean = false;
  url: any;

  constructor(
    private formBuilder: FormBuilder,
    private toast: NzMessageService,
    private clientService: ClientService,
    private router: Router,
    private route: ActivatedRoute,
    public contactPersonService: ContactPersonService,
  ) {
    this.route.params.subscribe(({ clientId }) => {
      if (clientId) {
        this.clientId = clientId
        this.getClientbyId(this.clientId)
        this.getContactPersons(this.clientId)
      }
    })
  }

  ngOnInit() {
    this.clientForm = this.formBuilder.group({
      id: [null],
      business_name: [null, [Validators.required]],
      street_number: [null, [Validators.required]],
      phone_number: [null, [Validators.required, ValidationService.phoneValidator]],
      postal_code: [null, [Validators.required]],
      city: [null, [Validators.required]],
      email: [null, [Validators.required, ValidationService.emailValidator]],
      logo: [null],
      logo_filename: [null],
    })
  }

  getContactPersons(clientId: any) {
    this.showLoadingContactPerson = true;
    this.contactPersonService.getAllContactPersons().subscribe(({ data }) => {
      this.contactPersons = data.filter(function (cp) {
        return cp.client_id == clientId
      })
      this.showLoadingContactPerson = false;
    })
  }

  getClientbyId(clientId: any) {
    this.showLoading = true;
    this.clientService.getClient(clientId)
      .subscribe(({ data }) => {
        this.Populate(data);
        this.showLoading = false;
      })
  }

  Submit() {
    this.method = this.clientId ? Methods.update : Methods.save;
    this.submitted = true

    if (this.clientForm.invalid) return

    let logoFileName = this.clientForm.get('logo_filename').value;
    this.clientForm.get('logo').setValue(logoFileName);

    this.clientService[this.method](this.clientForm.value).subscribe(
      client => {
        this.toast.success(`Client Successfully ${this.clientId ? 'Updated' : 'Added'}`)
        this.navigateTolistings()
      },
      error => {
        this.toast.error(error.error.message)
        let errorObj = error.error.errors
        Object.keys(errorObj).map(key => {
          if (key == 'email')
            this.clientForm.get(key).setErrors({ incorrect: true, emailUniqueError: errorObj[key][0] })
        })
        this.submitted = false;

      },
    )
  }

  navigateTolistings() {
    this.router.navigate(['/pages/client-management/clients'], { replaceUrl: true })
  }

  Populate(client) {
    Object.keys(client).forEach(k => {
      let control = <FormGroup>this.clientForm.get(k)
      if (control) {
        control.patchValue(client[k], { onlySelf: false })
      }
    })

    if (client.logo && ('url' in client.logo)) {
      this.dummy_text = false;
      this.url = environment.baseUrl + client.logo.url
    }
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

      this.clientService.uploadLogo(file_formData).subscribe(
        logo_image => {
          this.toast.success('Logo Uploaded SuccessFully!')
          this.clientForm.patchValue({
            logo_filename: logo_image['name'],
          })
        },
        error => {
          // this.errors = error.json().errors;
          // this.isLoading = false;
        },
      )
    }
  }

  deleteContactPerson(contactpersonId: any): void {
    this.contactPersonService.deleteContactPerson(contactpersonId).subscribe(
      res => {
        this.toast.success('Contact Person Deleted Successfully!');
        this.getContactPersons(this.clientId);
      },
      error => { },
    )
  }
}
