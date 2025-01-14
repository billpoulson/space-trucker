import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { AgGridAngular } from 'ag-grid-angular'

import { MaterialUIModule } from '../../../core/modules/material.ui.module'
import { AccelerationCurveComponent } from './acceleration-curve/acceleration-curve.component'
import { ActiveLoadsGridComponent } from './active-loads-grid/grid-example.component'
import { AppLoadingSpinnerComponent } from './app-loading-spinner/app-loading-spinner.component'
import { CardActionsExampleContent } from './card-example-content/card-example.component'
import { ChartComponent } from './chart/chart.component'
import { ConnectWebServiceButtonComponent } from './connect-webservice-button/connect-webservice.component'
import { CurrentUsernameComponent } from './current-username/current-username.component'
import { LogOutButtonComponent } from './log-out-button/log-out-button.component'
import { ClockToggleComponent } from './primitive/clock-toggle/clock-toggle.component'
import { TickCounterValueComponent } from './primitive/tick-counter-value/tick-counter-value.component'
import { TypographyComponent } from './primitive/typography/typography.component'
import { StackbarComponent } from './stackbar/stackbar.component'
import { StarMapViewPortComponentd } from './star-map copy/StarMapViewPort.component'
import { StarMapViewPortComponent } from './star-map/StarMapViewPort.component'
import { StartFakeRequestButtonComponent } from './start-fake-request-button/start-fake-request-button.component'
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
  AccelerationCurveComponent,
  StarMapViewPortComponent,
  StarMapViewPortComponentd,
  CurrentUsernameComponent,
  AppLoadingSpinnerComponent,
  StartFakeRequestButtonComponent,
  LogOutButtonComponent
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

