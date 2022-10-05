import { Component, OnInit } from '@angular/core';
import {CommonService} from "../../services/common.service";
import {Subject, takeUntil} from "rxjs";
import {ApiService} from "../../services/api.service";
import {ToastService} from "../../services/toast.service";

@Component({
  selector: 'app-add-folder-or-file',
  templateUrl: './add-folder-or-file.component.html',
  styleUrls: ['./add-folder-or-file.component.scss']
})
export class AddFolderOrFileComponent implements OnInit {

  user;
  editor;
  selectedFile;
  items = [];
  users = [];
  showLoader = false;
  componentInView = new Subject();

  constructor(
    private commonService: CommonService,
    private apiService: ApiService,
    private toastService: ToastService,
  ) { }

  ngOnInit(): void {

    if (localStorage.getItem('user')) {
      this.user = JSON.parse(localStorage.getItem('user'));
    }

    this.commonService.selectedFile.pipe(takeUntil(this.componentInView)).subscribe(response => {
      this.selectedFile = response;
    });

    this.commonService.sendFoldersOrFiles.pipe(takeUntil(this.componentInView)).subscribe((response: any) => {
      this.items = response;
    });
  }

  uploadFile(event): void {
    const file = event.target.files[0];

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload =  () => {
      this.upload(reader.result);
    };
    reader.onerror = function (error) {
      console.log('Error: ', error);
    };



  }

  upload(response): void {
    this.apiService.testing(response).subscribe(response => {
      console.log(response);
    })
  }

  onSaveFileContent(): void {
    this.showLoader = true;

    const params = {
      _id: this.selectedFile._id,
      userId: this.user._id,
      content: this.selectedFile.content
    }

    this.apiService.saveFileContent(params).pipe(takeUntil(this.componentInView)).subscribe(() => {
      this.showLoader = false;
      this.toastService.success('File content saved successfully');
      this.selectedFile = null;
    }, error => {
      this.showLoader = false;
      this.toastService.error(error.error.message);
    });
  }
}
