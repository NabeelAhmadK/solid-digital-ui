import { Component, OnInit, EventEmitter, Output } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { NzMessageService } from 'ng-zorro-antd/message'
import { UploadChangeParam } from 'ng-zorro-antd/upload'
import { Content, ContentService } from 'src/app/services/content'
import { DecimalPipe } from '@angular/common'
import { Router, ActivatedRoute } from '@angular/router'

@Component({
  selector: 'edit-content-form',
  templateUrl: './edit-content-form.component.html',
  styles: [':host ::ng-deep .ql-container {height: 200px;}'],
  providers: [ContentService, DecimalPipe],
})
export class EditContentFormComponent implements OnInit {
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

  contentForm: FormGroup
  sub
  content: Content
  id

  constructor(
    private fb: FormBuilder,
    private msg: NzMessageService,
    private contentService: ContentService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {
    this.contentForm = this.fb.group({
      content_name: ['', Validators.required],
      content_type: ['', Validators.required],
      content_email_subject: ['', Validators.nullValidator],
      content_html: ['', Validators.required],
    })
  }

  @Output()
  contentAdded: EventEmitter<Content> = new EventEmitter<Content>()

  saveContent(): void {
    this.contentService
      .updateContent(
        {
          name: this.contentForm.value.content_name,
          type: this.contentForm.value.content_type,
          html: this.contentForm.value.content_html,
          subject: this.contentForm.value.content_email_subject,
        },
        this.id,
      )
      .subscribe(
        content => {
          this.msg.success('Content Updated Successfully!')
          this.router.navigate(['/content-management/contents'])
        },
        error => {
          // this.errors = error.json().errors;
          // this.isLoading = false;
        },
      )
  }

  ngOnInit(): void {
    this.sub = this.activatedRoute.paramMap.subscribe(params => {
      this.id = params.get('id')
      this.contentService.getContent(this.id).subscribe(
        content => {
          this.content = content.data

          this.contentForm.patchValue({
            content_name: this.content.name,
            content_html: this.content.html,
            content_email_subject: this.content.subject,
          })

          if (this.content.type === 'Email') {
            this.contentForm.get('content_type').setValue(this.contentTypes[0].value)
          } else {
            this.contentForm.get('content_type').setValue(this.contentTypes[1].value)
          }
        },
        error => {},
      )
    })
  }

  ngOnDestroy() {
    this.sub.unsubscribe()
  }
}
