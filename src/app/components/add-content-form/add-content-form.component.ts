import { Component, OnInit, EventEmitter, Output } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { NzMessageService } from 'ng-zorro-antd/message'
import { UploadChangeParam } from 'ng-zorro-antd/upload'
import { Content, ContentService } from 'src/app/services/content'
import { DecimalPipe } from '@angular/common'
import { Router } from '@angular/router'
import { ValidationService } from '../../pages/advanced/validation'
@Component({
  selector: 'add-content-form',
  templateUrl: './add-content-form.component.html',
  styles: [':host ::ng-deep .ql-container {height: 200px;}'],
  providers: [ContentService, DecimalPipe],
})
export class AddContentFormComponent implements OnInit {
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

  constructor(
    private fb: FormBuilder,
    private msg: NzMessageService,
    private contentService: ContentService,
    private router: Router,
  ) {}

  submitted: boolean = false
  contentForm: FormGroup

  @Output()
  contentAdded: EventEmitter<Content> = new EventEmitter<Content>()

  ngOnInit(): void {
    this.contentForm = this.fb.group({
      content_name: ['', Validators.required],
      content_type: ['', Validators.required],
      content_html: ['', Validators.required],
      content_email_subject: ['', Validators.required],
    })
  }

  saveContent(): void {
    this.submitted = true
    if (this.contentForm.invalid) return
    this.contentService
      .addContent({
        name: this.contentForm.value.content_name,
        type: this.contentForm.value.content_type,
        html: this.contentForm.value.content_html,
        subject: this.contentForm.value.content_email_subject,
      })
      .subscribe(
        contentt => {
          this.msg.success('Content Added Successfully!')
          this.router.navigate(['/pages/content-management/contents'])
        },
        error => {
          // this.errors = error.json().errors;
          // this.isLoading = false;
        },
      )
  }
}
