import { ChangeDetectionStrategy, Component } from '@angular/core'

@Component({
  selector: 'app-block-filler',
  template: `<span class="expand-block"></span>`,
  styles: `:host { display: block }`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class BlockFiller { }
