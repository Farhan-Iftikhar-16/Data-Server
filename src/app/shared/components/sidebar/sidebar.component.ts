import {Component, OnInit} from '@angular/core';
import {CommonService} from "../../../services/common.service";
import {ToastService} from "../../../services/toast.service";
import {debounce, debounceTime, distinctUntilChanged, Subject, takeUntil} from "rxjs";
import {ApiService} from "../../../services/api.service";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  searchText;
  selectedFolderOrFile;
  user;
  selectedUsers = [];
  items = [];
  itemsCopy = [];
  users = [];
  showAddFolderOrFileDialog = false;
  showShareFoldersOrFilesDialog = false;
  isNewFolder = false;
  showLoader = false;
  contextMenu = [
    {label: 'Add Folder', command: () => {
      this.isNewFolder = true;
      this.selectedFolderOrFile.data.fileType === 'folder' ? this.showAddFolderOrFileDialog = true : this.toastService.error('Can not add folder in file')
    }},
    {label: 'Add File', command: () => {
      this.isNewFolder = false;
      this.selectedFolderOrFile.data.fileType === 'folder' ? this.showAddFolderOrFileDialog = true : this.toastService.error('Can not add file in file')
    }},
    {label: 'Share', command: () => {
      setTimeout(() => {
        this.showShareFoldersOrFilesDialog = true;
      });
    }},
    {label: 'Open / Edit File', command: () => {
      this.commonService.selectedFile.next(this.selectedFolderOrFile.data)
    }},
    {label: 'Delete', command: () => this.deleteFolderOrFile(this.selectedFolderOrFile.data)}
  ];
  private componentInView = new Subject();

  constructor(
    private commonService: CommonService,
    private toastService: ToastService,
    private apiService: ApiService
  ) { }

  ngOnInit(): void {
    if (localStorage.getItem('user')) {
      this.user = JSON.parse(localStorage.getItem('user'));
    }

    this.getListOfFoldersAndFiles();

    this.commonService.getListOfFoldersAndFiles.subscribe(() => {
      this.getListOfFoldersAndFiles();
    });
  }

  getListOfFoldersAndFiles(): void {
    this.showLoader = true;

    this.apiService.getListOfFoldersAndFiles(this.user._id).pipe(takeUntil(this.componentInView)).subscribe(response => {
      this.showLoader = false;
      this.items = this.setItems(response.data);
      this.itemsCopy = [...this.items];
      this.commonService.sendFoldersOrFiles.next(this.items);
    }, error => {
      this.showLoader = false;
      this.toastService.error(error.error.message);
    });
  }

  setItems(items): any[] {
    return items.map(item => {
      return {
        label: item.name,
        data: item,
        expandedIcon: item.fileType && item.fileType === 'folder' ? 'pi pi-folder' : 'pi pi-circle-fill',
        collapsedIcon: item.fileType && item.fileType === 'folder' ? 'pi pi-folder' : 'pi pi-circle-fill',
        children: item.children && item.children.length > 0 ? this.setItems(item.children) : [],
        droppable: item.fileType && item.fileType === 'folder'
      };
    });
  }

  searchItems(): void {
    if (!this.searchText) {
      this.items = [...this.itemsCopy];
      return;
    }
    this.items = this.itemsCopy.filter(item => this.filterItem(item));
  }

  filterItem(item): any {
    const itemNames = this.mapItemName(item).map(item => item.toLowerCase());
    if (itemNames && itemNames.length > 0 && itemNames.includes(this.searchText.toLowerCase())) {
      return item;
    }
  }

  mapItemName(item, parentItemNameArray = []): string[] {
    let itemNameArray;
    if (parentItemNameArray && parentItemNameArray.length === 0) {
      itemNameArray = [item.label];
    }

    if (parentItemNameArray && parentItemNameArray.length > 0) {
      itemNameArray = [...parentItemNameArray,  item.label];
    }

    if (item.children && item.children.length > 0) {
      item.children.forEach(childItem => {
        itemNameArray = this.mapItemName(childItem, itemNameArray);
      });
    }
    return itemNameArray;
  }

  deleteFolderOrFile(item): void {
    this.showLoader = true;

    const params = {
      _id: item._id,
      userId: this.user._id
    };

    this.apiService.deleteFolderOrFile(params).pipe(takeUntil(this.componentInView)).subscribe(() => {
      this.showLoader = false;
      this.toastService.success(item.type === 'folder' ? 'Folder deleted successfully' : 'File deleted successfully');
      this.getListOfFoldersAndFiles();
    }, error => {
      this.showLoader = false;
      this.toastService.error(error.error.message);
    });
  }

  shareFoldersOrFilesWithUsers(foldersOrFiles): void {
    this.showLoader = true;

    const params = {
      data: foldersOrFiles
    };

    this.apiService.shareFoldersOrFilesWithUsers(params).pipe(takeUntil(this.componentInView)).subscribe(() => {
      this.showLoader = false;
      this.toastService.success('Share Successfully');
    }, error => {
      this.showLoader = false;
      this.toastService.error(error.error.message);
    });
  }



  onSaveClicked(): void {
    const folderOrFileToShare = [];

    if (this.selectedUsers && this.selectedUsers.length === 0) {
      this.toastService.error('Please Select User First');
      return
    }

    this.selectedUsers.forEach(user => {
      folderOrFileToShare.push(this.setFolderOrFileToShare(this.selectedFolderOrFile.data ,user));
    });

    this.shareFoldersOrFilesWithUsers(folderOrFileToShare);
  }

  setFolderOrFileToShare(item, user): any {
    const data = {
      name: item.name,
      fileType: item.fileType,
      userId: user.id,
      createdBy: item.createdBy,
      children: [],
    };

    if (item.children && item.children.length > 0) {
      item.children.forEach(childItem => {
        data.children.push(this.setFolderOrFileToShare(childItem, user));
      });
    }

    return data;
  }

  searchUsers(event): void {
    this.showLoader = true;

    this.apiService.searchUsers(this.user._id, event.query).pipe( takeUntil(this.componentInView), debounceTime(1000), distinctUntilChanged()).subscribe(response => {
      this.showLoader = false;
      this.users = response.users;
    }, error =>  {
      this.showLoader = false;
      this.users = [];
      this.toastService.error(error.error.message);

    });
  }
}
