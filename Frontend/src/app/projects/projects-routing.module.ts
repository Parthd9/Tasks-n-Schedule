import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { KanbanComponent } from './kanban/kanban.component';
import { ProjectComponent } from './project/project.component';
import { SprintComponent } from './sprint/sprint.component';
import { SubtaskComponent } from './subtask/subtask.component';
import { VersionComponent } from './version/version.component';


const routes: Routes = [
    {path:'project', component: HomePageComponent, children: [
          { path: '', component: ProjectComponent},
          { path: 'version', component: VersionComponent},
          { path: 'version/sprint', component: SprintComponent},
          { path: 'version/sprint/backlog', component: KanbanComponent},
          { path: 'version/sprint/backlog/subtask', component: SubtaskComponent}
        ]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectsRoutingModule {}
