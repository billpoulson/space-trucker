import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { AgGridAngular } from 'ag-grid-angular'
import { MaterialUIModule } from '../../core/modules/material.ui.module'
import { CardActionsExampleContent } from './card-example-content/card-example.component'
import { ClockToggleComponent } from './primitive/clock-toggle/clock-toggle.component'
import { TypographyComponent } from './primitive/typography/typography.component'

import { RouterModule } from '@angular/router'
import { AccelerationCurveComponent } from './acceleration-curve/acceleration-curve.component'
import { ActiveLoadsGridComponent } from './active-loads-grid/grid-example.component'
import { ChartComponent } from './chart/chart.component'
import { ConnectWebServiceButtonComponent } from './connect-webservice-button/connect-webservice.component'
import { TickCounterValueComponent } from './primitive/tick-counter-value/tick-counter-value.component'
import { StackbarComponent } from './stackbar/stackbar.component'
import { TruckDetailsComponent } from './truck-details/truck-details.component'
import { UserProfileComponent } from './user-profile/callback.component'

const sharedComponents = [
  ActiveLoadsGridComponent,
  CardActionsExampleContent,
  TickCounterValueComponent,
  ClockToggleComponent,
  TypographyComponent,
  TruckDetailsComponent,
  UserProfileComponent,
  ConnectWebServiceButtonComponent,
  StackbarComponent,
  ChartComponent,
  AccelerationCurveComponent
]

@NgModule({
  imports: [
    CommonModule,
    AgGridAngular,
    MaterialUIModule,
    RouterModule,
  ],
  declarations: sharedComponents,
  exports: [...sharedComponents]
})
export class SharedUIComponentsModule { }

