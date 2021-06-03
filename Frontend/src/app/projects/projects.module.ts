import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { MaterialModule } from "../material.module";
import { SharedModule } from "../shared/shared.module";
import { HomePageComponent } from "./home-page/home-page.component";

import { KanbanComponent } from "./kanban/kanban.component";
import { AddBacklogComponent } from "./modals/add-backlog/add-backlog.component";
import { AddProjectDialogComponent } from "./modals/add-project-dialog/add-project-dialog.component";
import { EmailComponent } from "./modals/email/email.component";
import { SubtaskcompletionComponent } from "./modals/subtaskcompletion/subtaskcompletion.component";
import { ProjectComponent } from "./project/project.component";
import { ProjectsRoutingModule } from "./projects-routing.module"
import { SprintComponent } from "./sprint/sprint.component";
import { SubtaskComponent } from "./subtask/subtask.component";
import { VersionComponent } from "./version/version.component";
import { AddVersionComponent } from './modals/add-version/add-version.component';

@NgModule({
    declarations: [
        HomePageComponent,
        ProjectComponent,
        AddProjectDialogComponent,
        VersionComponent,
        EmailComponent,
        SprintComponent,
        KanbanComponent,
        AddBacklogComponent,
        SubtaskComponent,
        SubtaskcompletionComponent,
        AddVersionComponent
    ],
    imports: [
        RouterModule,
        FormsModule,
        ReactiveFormsModule,
        ProjectsRoutingModule,
        MaterialModule,
        SharedModule
    ]
})

export class ProjectsModule {}