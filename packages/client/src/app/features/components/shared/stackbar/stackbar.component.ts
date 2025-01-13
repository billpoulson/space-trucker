import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core'
import { BehaviorSubject } from 'rxjs'

@Component({
  selector: 'app-stackbar',
  templateUrl: './stackbar.component.html',
  styleUrl: './stackbar.component.css',
  changeDetection: ChangeDetectionStrategy.Default,
  standalone: false
})
export class StackbarComponent implements OnInit, OnChanges {
  ngOnChanges(changes: SimpleChanges): void {
    this.blocks.next(Array.from({ length: this.blockCount }));
  }
  @Input()
  blockCount = 0;

  ngOnInit(): void {
  }
  blocks = new BehaviorSubject<Array<number>>([]); // Creates an array with 100 undefined elements
  wrap = true; // This enables flex-wrap, allowing blocks to fill from right to left
}
