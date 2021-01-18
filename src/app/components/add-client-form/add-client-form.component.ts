import { Component, OnInit, EventEmitter, Output } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { NzMessageService } from 'ng-zorro-antd/message'
import { UploadChangeParam } from 'ng-zorro-antd/upload'
import { Client, ClientService } from 'src/app/services/client'
import { DecimalPipe } from '@angular/common'
import { Router } from '@angular/router'

@Component({
  selector: 'add-client-form',
  templateUrl: './add-client-form.component.html',
  styleUrls: ['./add-client-form.component.scss'],
  providers: [ClientService, DecimalPipe],
})
export class AddClientFormComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private msg: NzMessageService,
    private clientService: ClientService,
    private router: Router,
  ) {}

  clientForm: FormGroup
  dummy_text: boolean = true
  url

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

      console.log(this.url)
      this.dummy_text = false

      const file_formData = new FormData()
      file_formData.append('file', file)

      this.clientService.uploadLogo(file_formData).subscribe(
        logo_image => {
          this.msg.success('Logo Uploaded SuccessFully!')
          console.log(logo_image['name'])
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
      .addClient({
        business_name: this.clientForm.value.business_name,
        street_number: this.clientForm.value.straat_number,
        postal_code: this.clientForm.value.postal_code,
        city: this.clientForm.value.city,
        phone_number: this.clientForm.value.phone_number,
        email: this.clientForm.value.business_email,
        logo: this.clientForm.value.logo_filename,
      })
      .subscribe(
        client => {
          this.msg.success('Client Added Successfully!')
          this.router.navigate(['/'])
        },
        error => {
          // this.errors = error.json().errors;
          // this.isLoading = false;
        },
      )
  }

  ngOnInit(): void {
    this.clientForm = this.fb.group({
      business_name: ['', Validators.required],
      straat_number: ['', Validators.required],
      phone_number: ['', Validators.required],
      postal_code: ['', Validators.required],
      city: ['', Validators.required],
      business_email: ['', Validators.required],
      logo: ['', Validators.required],
      logo_filename: ['', Validators.required],
    })
  }
}
