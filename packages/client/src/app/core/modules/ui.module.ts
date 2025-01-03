import { NgModule } from '@angular/core';
import { AllCommunityModule, ClientSideRowModelModule, ModuleRegistry } from 'ag-grid-community';
import { SharedUIComponentsModule } from '../../features/components/shared.ui.module';
import { MaterialUIModule } from './material.ui.module';


ModuleRegistry.registerModules([
  AllCommunityModule,
  ClientSideRowModelModule,
]);

const modules = [
  MaterialUIModule,
  SharedUIComponentsModule,
]

@NgModule({
  imports: modules,
  exports: modules,
})
export class UIModule { }

