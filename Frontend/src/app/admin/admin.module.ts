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
import { AdminResolverService } from "./admin-resolver.service";
import { UploadDataComponent } from "./upload-data/upload-data.component";
import { NgxFileDropModule } from "ngx-file-drop";

@NgModule({
    declarations: [
        AdminPageComponent,
        BarChartComponent,
        PieChartComponent,
        ManageUsersComponent,
        UpsertUserComponent,
        AdminHomeComponent,
        UploadDataComponent
    ],
    imports: [
        RouterModule.forChild([
            { path: '', component: AdminHomeComponent ,canActivate: [AuthGuard, AdminGuard],children: [
                {path: '', component: AdminPageComponent,resolve: {responses: AdminResolverService}},
                {path: 'manage-users', component: ManageUsersComponent}
            ]
        }
        ]),
        FormsModule,
        MaterialModule,
        SharedModule,
        NgxFileDropModule
    ]
})

export class AdminModule {}
