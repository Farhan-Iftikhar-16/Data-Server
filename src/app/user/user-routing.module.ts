import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {UserWrapperComponent} from "./user-wrapper/user-wrapper.component";
import {AddFolderOrFileComponent} from "./add-folder-or-file/add-folder-or-file.component";

const routes: Routes = [
  {
    path: '',
    component: UserWrapperComponent,
    children: [
      {
        path: '',
        redirectTo: 'add-folder-or-file',
        pathMatch: 'full'
      },
      {
        path: 'add-folder-or-file',
        component: AddFolderOrFileComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class UserRoutingModule {

}
