import { Component, OnInit, EventEmitter, Output } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { NzMessageService } from 'ng-zorro-antd/message'
import { UploadChangeParam } from 'ng-zorro-antd/upload'
import { Client, ClientService } from 'src/app/services/client'
import { DecimalPipe } from '@angular/common'
import { Router, ActivatedRoute } from '@angular/router'
import { environment } from 'src/environments/environment'
@Component({
  selector: 'edit-client-form',
  templateUrl: './edit-client-form.component.html',
  styleUrls: ['./edit-client-form.component.scss'],
  providers: [ClientService, DecimalPipe],
})
export class EditClientFormComponent implements OnInit {
  client_id: any
  constructor(
    private fb: FormBuilder,
    private msg: NzMessageService,
    private clientService: ClientService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {
    this.clientForm = this.fb.group({
      business_name: ['', Validators.required],
      street_number: ['', Validators.required],
      phone_number: ['', Validators.required],
      postal_code: ['', Validators.required],
      city: ['', Validators.required],
      business_email: ['', Validators.required],
      logo: ['', Validators.required],
      logo_filename: ['', Validators.required],
    })

    this.sub = this.activatedRoute.paramMap.subscribe(params => {
      this.client_id = params.get('id')

      this.clientService.getClient(this.client_id).subscribe(
        client => {
          this.client = client.data

          this.clientForm.patchValue({
            business_name: this.client.business_name,
            street_number: this.client.street_number,
            phone_number: this.client.phone_number,
            postal_code: this.client.postal_code,
            city: this.client.city,
            business_email: this.client.email,
          })
          this.url = `${environment.baseUrl}` + this.client.logo['url']
          this.dummy_text = false
        },
        error => {
          // this.errors = error.json().errors;
          // this.isLoading = false;
        },
      )
    })
  }

  clientForm: FormGroup
  dummy_text: boolean = true
  url
  sub
  client: Client

  @Output()
  clientAdded: EventEmitter<Client> = new EventEmitter<Client>()

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

      this.clientService.uploadLogo(file_formData).subscribe(
        logo_image => {
          this.msg.success('Logo Uploaded SuccessFully!')
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

  saveBusiness(): void {
    this.clientService
      .updateClient(
        {
          business_name: this.clientForm.value.business_name,
          street_number: this.clientForm.value.street_number,
          postal_code: this.clientForm.value.postal_code,
          city: this.clientForm.value.city,
          phone_number: this.clientForm.value.phone_number,
          email: this.clientForm.value.business_email,
          logo: this.clientForm.value.logo_filename,
        }
      )
      .subscribe(
        client => {
          this.msg.success('Client Updated Successfully!')
          this.router.navigate(['/client-management/clients/'])
        },
        error => {
          // this.errors = error.json().errors;
          // this.isLoading = false;
        },
      )
  }

  addContactPerson(): void {
    this.router.navigate(['/client/add_contact_person/' + this.client_id])
  }

  ngOnInit(): void { }

  ngOnDestroy() {
    this.sub.unsubscribe()
  }
}
