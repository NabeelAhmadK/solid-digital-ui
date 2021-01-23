import { Component, OnInit, EventEmitter, Output } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { NzMessageService } from 'ng-zorro-antd/message'
import { UploadChangeParam } from 'ng-zorro-antd/upload'
import { Content, ContentService } from 'src/app/services/content'
import { DecimalPipe } from '@angular/common'
import { Router, ActivatedRoute } from '@angular/router'
import { ValidationService } from '../../../pages/advanced/validation'

enum Methods {
  save = 'addContent',
  update = 'updateContent'
}
@Component({
  selector: 'app-content-crud',
  templateUrl: './content-crud.component.html',
  styles: [':host ::ng-deep .ql-container {height: 200px;}'],
  providers: [ContentService, DecimalPipe],
})
export class ContentCrudComponent implements OnInit {

  contentTypes = [
    {
      label: 'Email',
      value: 'email',
    },
    {
      label: 'Other',
      value: 'other',
    },
  ]
  contentId: any;
  method: any;
  submitted: boolean = false
  contentForm: FormGroup

  constructor(
    private formBuilder: FormBuilder,
    private toast: NzMessageService,
    private contentService: ContentService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.route.params.subscribe(({ contentId }) => {
      if (contentId) {
        this.contentId = contentId;
        this.getContentbyId(this.contentId)
      }
    })
  }

  ngOnInit() {
    this.contentForm = this.formBuilder.group({
      id: [null],
      name: [null, Validators.required],
      type: [null, Validators.required],
      subject: [null, Validators.required],
      html: [null, Validators.required],
    })
  }

  Submit(): void {
    this.method = this.contentId ? Methods.update : Methods.save;

    this.submitted = true
    if (this.contentForm.invalid) return
    this.contentService
    [this.method](this.contentForm.value)
      .subscribe(
        contentt => {
          this.toast.success(`Content Successfully ${this.contentId ? 'Updated' : 'Added'}`)
          this.navigateTolistings()
        },
        error => {
          // this.errors = error.json().errors;
          // this.isLoading = false;
        },
      )
  }

  navigateTolistings() {
    this.router.navigate(['/content-management/contents'])
  }

  getContentbyId(contentId: any) {
    this.contentService.getContent(contentId).subscribe(
      ({ data }) => {
        this.Populate(data)
      },
      error => { },
    )
  }

  Populate(content) {
    Object.keys(content).forEach(k => {
      let control = <FormGroup>this.contentForm.get(k)
      if (control) {
        control.patchValue(content[k], { onlySelf: false })
      }
    })
  }

}
