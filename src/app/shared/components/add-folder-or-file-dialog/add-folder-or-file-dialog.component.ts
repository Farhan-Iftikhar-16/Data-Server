import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CommonService} from "../../../services/common.service";
import {Subject, takeUntil} from "rxjs";
import {ApiService} from "../../../services/api.service";
import {ToastService} from "../../../services/toast.service";

@Component({
  selector: 'app-add-folder-or-file-dialog',
  templateUrl: './add-folder-or-file-dialog.component.html',
  styleUrls: ['./add-folder-or-file-dialog.component.scss']
})
export class AddFolderOrFileDialogComponent implements OnInit {

  folderOrFileName;
  showDialog = false;
  showLoader = false;
  @Input() user;
  @Input() selectedFolderOrFile;
  @Input() isFolder;
  @Output() hideAddFolderOrFileDialog = new EventEmitter();
  private componentInView = new Subject()

  constructor(
    private apiService: ApiService,
    private toastService: ToastService
  ) { }

  ngOnInit(): void {
    this.showDialog = true;
  }

  onSaveClicked(): void {
    this.showLoader = true;

    console.log(this.selectedFolderOrFile);

    const params = {
      name: this.folderOrFileName,
      fileType: this.isFolder ? 'folder' : 'file',
      userId: this.user._id,
      parentId: this.selectedFolderOrFile && this.selectedFolderOrFile._id ? this.selectedFolderOrFile._id : null,
      createdBy: `${this.user.firstName} ${this.user.lastName}`
    };

    this.apiService.addNewFolderOrFile(params).pipe(takeUntil(this.componentInView)).subscribe(() => {
      this.showLoader = false;
      this.toastService.success( this.isFolder ? 'Folder added successfully' : 'File added successfully');
      this.hideAddFolderOrFileDialog.emit();
    }, error => {
      this.showLoader = false;
      this.toastService.error(error.error.message);
    });
  }

  onCloseClicked(): void {
    this.showDialog = false;
    this.hideAddFolderOrFileDialog.emit();
  }

}
