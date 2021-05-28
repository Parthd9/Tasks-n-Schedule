import { NgModule } from "@angular/core";

import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button'
import {MatIconModule} from '@angular/material/icon';
import {MatCardModule} from '@angular/material/card';
import {MatTabsModule} from '@angular/material/tabs';
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatDialogModule } from "@angular/material/dialog";
import { MatInputModule } from "@angular/material/input";
import { MatListModule } from "@angular/material/list";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatSelectModule } from "@angular/material/select";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatSortModule } from "@angular/material/sort";
import { MatTableModule } from "@angular/material/table";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectFilterModule } from 'mat-select-filter';
import {MatBadgeModule} from '@angular/material/badge';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { ChartsModule } from 'ng2-charts';
import { CommonModule } from "@angular/common";

@NgModule({
    imports: [
        MatMenuModule,
        MatButtonModule,
        MatIconModule,
        MatCardModule,
        MatTabsModule,
        MatDatepickerModule,
        MatDialogModule,
        MatInputModule,
        MatListModule,
        MatPaginatorModule,
        MatProgressSpinnerModule,
        MatSelectModule,
        MatSidenavModule,
        MatSortModule,
        MatTableModule,
        MatToolbarModule,
        MatTooltipModule,
        MatSelectFilterModule,
        MatBadgeModule,
        MatCheckboxModule,
        ChartsModule,
        CommonModule
    ],
    exports: [
        MatMenuModule,
        MatButtonModule,
        MatIconModule,
        MatCardModule,
        MatTabsModule,
        MatDatepickerModule,
        MatDialogModule,
        MatInputModule,
        MatListModule,
        MatPaginatorModule,
        MatProgressSpinnerModule,
        MatSelectModule,
        MatSidenavModule,
        MatSortModule,
        MatTableModule,
        MatToolbarModule,
        MatTooltipModule,
        MatSelectFilterModule,
        MatBadgeModule,
        MatCheckboxModule,
        ChartsModule
    ]
})

export class MaterialModule {}