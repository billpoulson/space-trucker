import { AfterViewInit, Component } from '@angular/core'
import { newUUID } from '@space-truckers/common'
import { Chart } from 'chart.js'
import { AccelerationProfileGraphService } from './acceleration-profile-graph.service'




@Component({
  selector: 'app-acceleration-curve',
  standalone: false,

  templateUrl: './acceleration-curve.component.html',
  styleUrl: './acceleration-curve.component.scss'
})
export class AccelerationCurveComponent implements AfterViewInit {
  chart!: Chart
  uuid: string = newUUID()
  constructor(
    private graphService: AccelerationProfileGraphService
  ) { }

  ngAfterViewInit(): void {
    this.chart = this.graphService.createAccelerationProfileChart(this.uuid)
  }
}
