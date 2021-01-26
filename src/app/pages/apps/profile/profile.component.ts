import { DecimalPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core'
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { ContactPersonService } from '../../../services/contact-person'
import { NzMessageService } from 'ng-zorro-antd/message'
import { ValidationService } from '../../../pages/advanced/validation'
import { jwtAuthService } from '../../../services/jwt';
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
    private router: Router,
    private authService: jwtAuthService
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
    let result = this.updatePasswordForm.value;
    delete result.c_password;

    this.authService.changePassword(this.updatePasswordForm.value)
      .subscribe(({ token }) => {
        this.toast.success('Password Changed Successfully');
        this.updatePasswordForm.reset();
        localStorage.setItem('accessToken', token);
        this.submitted = false;
      })
  }

  Submit() {
    this.profileForm.get('email').enable();
    let result = this.profileForm.value;
    if (!this.isImageUpdated) delete result.profile_image;
    this.contactPersonService.updateUser(result)
      .subscribe(res => {
        this.profileForm.get('email').disable();
        this.toast.success('Profile Updated Successfully');
        let userData = JSON.parse(localStorage.getItem('userData'));

        // if (!this.isImageUpdated) {
        // this.contactPersonService.getUserProfileImage({ id: this.profileForm.get('id').value })
        //   .subscribe(currentAccount => {
        //     userData.profile_image.url = currentAccount.data.profile_image.url;
        //   })
        // }
        userData.name = res.data.name
        localStorage.setItem('userData', JSON.stringify(userData));
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
          this.isImageUpdated = true;
          this.toast.success('Profile Image Uploaded SuccessFully')
          this.profileForm.patchValue({
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
