import { DecimalPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core'
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { ContactPersonService } from '../../../services/contact-person'
import { NzMessageService } from 'ng-zorro-antd/message'
import { ValidationService } from '../../../pages/advanced/validation'
import { Router } from '@angular/router'
@Component({
  selector: 'app-apps-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  providers: [ContactPersonService, DecimalPipe],
})
export class AppsProfileComponent implements OnInit {
  activeKey = 2
  userData: any;
  profileImageUrl: any;
  profileForm: FormGroup;
  updatePasswordForm: FormGroup;
  originalUrl: any;
  submitted: boolean = false;
  isImageUpdated: boolean = false;
  constructor(
    private formBuilder: FormBuilder,
    private contactPersonService: ContactPersonService,
    private toast: NzMessageService,
    private router: Router
  ) { }

  ngOnInit() {
    this.userData = JSON.parse(localStorage.getItem('userData'));
    if ('profile_image' in this.userData) {
      this.profileImageUrl = environment.baseUrl + this.userData.profile_image?.url
      this.originalUrl = environment.baseUrl + this.userData.profile_image?.url
    }

    this.profileForm = this.formBuilder.group({
      id: [null],
      email: [null],
      name: [null],
      role: [null],
      profile_image: [null]
    })

    this.updatePasswordForm = this.formBuilder.group({
      id: [null],
      password: [null, [Validators.required, Validators.minLength(6)]],
      c_password: [null, [Validators.required, Validators.minLength(6)]]
    }, {
      validators: ValidationService.matchValidator('password', 'c_password')
    })

    this.profileForm.get('email').disable();
    this.Populate(this.userData)

  }

  changeKey(key) {
    this.activeKey = key
  }

  Populate(profile) {
    Object.keys(profile).forEach(k => {
      let control = <FormGroup>this.profileForm.get(k)
      if (control) {
        control.patchValue(profile[k], { onlySelf: false })
      }
    })
  }

  UpdatePasword() {
    this.submitted = true;
    if (this.updatePasswordForm.invalid) return;

    this.updatePasswordForm.get('id').setValue(this.userData.id);

    this.contactPersonService.updateUser(this.updatePasswordForm.value)
      .subscribe(res => {
        this.toast.success('Password Updated Successfully');
        this.router.navigate(['/auth/login'], { replaceUrl: true });
      })
  }

  Submit() {
    this.profileForm.get('email').enable();
    let result = this.profileForm.value;
    if (!this.isImageUpdated) delete result.profile_image;
    this.contactPersonService.updateUser(this.profileForm.value)
      .subscribe(res => {
        this.profileForm.get('email').disable();
        this.toast.success('Profile Updated Successfully');
        localStorage.setItem('userData', JSON.stringify(res['data']));
        window.location.reload();
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
      this.profileImageUrl = reader.result as string
      const file_formData = new FormData()
      file_formData.append('file', file)
      this.contactPersonService.uploadProfileImage(file_formData).subscribe(
        profile_image => {
          this.toast.success('Profile Image Uploaded SuccessFully')
          this.profileForm.patchValue({
            profile_image: profile_image['name'],
          })
          this.isImageUpdated = true;
        },
        error => {
          // this.errors = error.json().errors;
          // this.isLoading = false;
        },
      )
    }
  }
}
