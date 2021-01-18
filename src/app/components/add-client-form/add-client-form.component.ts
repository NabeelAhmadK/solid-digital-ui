import { Component, OnInit, EventEmitter, Output } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { NzMessageService } from 'ng-zorro-antd/message'
import { UploadChangeParam } from 'ng-zorro-antd/upload'
import { Client, ClientService } from 'src/app/services/client'
import { DecimalPipe } from '@angular/common'
import { ValidationService } from '../../pages/advanced/validation'
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
  submitted: boolean = false
  url

  @Output()
  clientAdded: EventEmitter<Client> = new EventEmitter<Client>()

  ngOnInit(): void {
    this.clientForm = this.fb.group({
      business_name: [null, [Validators.required]],
      street_number: [null, [Validators.required]],
      phone_number: [null, [Validators.required, ValidationService.phoneValidator]],
      postal_code: [null, [Validators.required, ValidationService.numberValidator]],
      city: [null, [Validators.required]],
      email: [null, [Validators.required, ValidationService.emailValidator]],
      logo: [null],
      logo_filename: [null],
    })
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
    this.submitted = true
    if (this.clientForm.invalid) return
    this.clientService.addClient(this.clientForm.value).subscribe(
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
}
