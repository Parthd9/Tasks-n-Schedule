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
import { AdminHomeComponent } from './admin-home/admin-home.component';
import { AuthGuard } from "../auth/auth.guard";
import { AdminGuard } from "../auth/admin.guard";

@NgModule({
    declarations: [
        AdminPageComponent,
        BarChartComponent,
        PieChartComponent,
        ManageUsersComponent,
        UpsertUserComponent,
        AdminHomeComponent
    ],
    imports: [
        RouterModule.forChild([
            { path: '', component: AdminHomeComponent ,canActivate: [AuthGuard, AdminGuard],children: [
                {path: '', component: AdminPageComponent},
                {path: 'manage-users', component: ManageUsersComponent}
            ]
        }
        ]),
        FormsModule,
        MaterialModule,
        SharedModule
    ]
})

export class AdminModule {}
