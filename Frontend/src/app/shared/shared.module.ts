import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { MaterialModule } from "../material.module";
import { ConfirmComponent } from "./confirm/confirm.component";
import { VisualChartComponent } from "./visual-chart/visual-chart.component";


@NgModule({
    declarations: [
        VisualChartComponent,
        ConfirmComponent
    ],
    imports: [
        RouterModule.forChild([
            { path: 'visual-chart', component: VisualChartComponent }
        ]),
        CommonModule,
        FormsModule,
        MaterialModule
    ],
    exports: [
        VisualChartComponent,
        ConfirmComponent,
        CommonModule
    ]
})

export class SharedModule {}