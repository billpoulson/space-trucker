import { BehaviorSubject } from 'rxjs'
import { RenderTargetSizeChangeEvent } from './render-target-size-change.event'


export class RenderTargetSize {
  change$: BehaviorSubject<RenderTargetSizeChangeEvent>
  constructor(
    public h: number,
    public w: number
  ) {
    this.change$ = new BehaviorSubject<RenderTargetSizeChangeEvent>(this.getEvent())
  }
  private getEvent(): RenderTargetSizeChangeEvent {
    return {
      h: this.h,
      w: this.w,
      aspect: this.aspect()
    }
  }

  update(h: number, w: number) {
    this.h = h
    this.w = w
    this.change$.next(this.getEvent())
  }
  aspect() { return this.h / this.w }
}
