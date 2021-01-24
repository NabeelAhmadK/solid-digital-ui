import { Component, OnInit } from '@angular/core'
import { FormGroup, FormBuilder } from '@angular/forms';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-apps-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class AppsProfileComponent implements OnInit {
  activeKey = 2
  userData: any;
  profileImageUrl: any;
  profileForm: FormGroup;
  constructor(
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.userData = JSON.parse(localStorage.getItem('userData'));
    if ('profile_image' in this.userData) {
      this.profileImageUrl = environment.baseUrl + this.userData.profile_image?.url
    }

    this.profileForm = this.formBuilder.group({
      id: [null],
      email: [null],
      name: [null],
      password: [null],
      c_password: [null]
    })

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
}
