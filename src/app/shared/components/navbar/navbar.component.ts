import {Component, Input, OnInit} from '@angular/core';
import {CommonService} from "../../../services/common.service";
import {ApiService} from "../../../services/api.service";
import {Subject, takeUntil} from "rxjs";
import {ToastService} from "../../../services/toast.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  user;
  showLoader = false;
  @Input() isUserLoggedIn;
  componentInView = new Subject();

  constructor(
    private commonService: CommonService,
    private apiService: ApiService,
    private toastService: ToastService,
    private router: Router
  ) { }

  ngOnInit(): void {
    if (this.isUserLoggedIn && localStorage.getItem('user')) {
      this.user = JSON.parse(localStorage.getItem('user'));
    }
  }

  onBackupClicked(): void {
    this.showLoader = true;

    this.apiService.createBackup().pipe(takeUntil(this.componentInView)).subscribe(() => {
      this.showLoader = false;
      this.toastService.success('Backup created successfully');
    }, error => {
      this.showLoader = false;
      this.toastService.error(error.error.message);
    });
  }

  onLogoutClick(): void {
    this.showLoader = true;

    this.apiService.logout(this.user.loginId).pipe(takeUntil(this.componentInView)).subscribe(() => {
      this.showLoader = false;
      localStorage.clear();
      this.router.navigate(['/auth/login']).then();
    }, error => {
      this.showLoader = false;
      this.toastService.error(error.error.message);
    });
  }


}
