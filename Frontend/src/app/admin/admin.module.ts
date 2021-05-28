import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { MaterialModule } from "../material.module";
import { SharedModule } from "../shared/shared.module";
import { AdminPageComponent } from "./admin-page/admin-page.component";
import { BarChartComponent } from "./bar-chart/bar-chart.component";
import { ManageUsersComponent } from "./manage-users/manage-users.component";
import { PieChartComponent } from "./pie-chart/pie-chart.component";
import { UpsertUserComponent } from "./upsert-user/upsert-user.component";

@NgModule({
    declarations: [
        AdminPageComponent,
        BarChartComponent,
        PieChartComponent,
        ManageUsersComponent,
        UpsertUserComponent
    ],
    imports: [
        RouterModule.forChild([
            { path: 'admin', component: AdminPageComponent },
            { path: 'admin/manage-users', component: ManageUsersComponent}
        ]),
        FormsModule,
        MaterialModule,
        SharedModule
    ]
})

export class AdminModule {}