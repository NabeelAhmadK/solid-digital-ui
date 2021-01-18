import { Component } from '@angular/core'

@Component({
  selector: 'kit-antd-tag-example',
  templateUrl: './tag.component.html',
})
export class KitAntdTagExampleComponent {
  onClose(): void {}

  preventDefault(e: Event): void {
    e.preventDefault()
    e.stopPropagation()
  }
}
