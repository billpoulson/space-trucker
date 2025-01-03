import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject } from '@angular/core';
import type { ColDef, GridApi, GridReadyEvent, Theme } from 'ag-grid-community'; // Column Definition Type Interface
import { THEME_TOKEN } from '../../../config/theme.config';
import { LoadsService } from '../../../core/services/loads/loads.service';
import { LoadDefinitionData } from '../../../core/system/data/load';


@Component({
  selector: 'app-grid-example',
  templateUrl: `grid-example.component.html`,
  styleUrls: ['./grid-example.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class ActiveLoadsGridComponent {

  private gridApi!: GridApi;
  constructor(
    @Inject(THEME_TOKEN) public theme: Theme<any>,
    ls: LoadsService,
    private cdr: ChangeDetectorRef
  ) {

    setInterval(async () => {
      const { keys, data } = ls.getEnumerableDB()
      this.datasource = keys
        .reduce((acc, curr) => { return [...acc, data[curr]] }, [] as Array<LoadDefinitionData>)
        .sort(newFunction())
      this.cdr.detectChanges()
    }, 1000);
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }
  datasource: Array<LoadDefinitionData> = [];

  // Column Definitions: Defines the columns to be displayed.
  colDefs: ColDef[] = [
    { field: "key" },
    { field: "percentageCompleted" },
    { field: "mass" },
    { field: "cargoValue" },
    { field: "distance" },
    { field: "progress" },
    { field: "pirated" }
  ];


}
function newFunction(): ((a: LoadDefinitionData, b: LoadDefinitionData) => number) | undefined {
  return (a, b) => +b.key - +a.key;
}

