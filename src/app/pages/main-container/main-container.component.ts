import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AppState } from 'src/app/app.state';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-main-container',
  templateUrl: './main-container.component.html',
  styleUrls: ['./main-container.component.scss']
})
export class MainContainerComponent implements OnInit {
  public isMenuCollapsed: boolean = false;

  constructor(
    private _state: AppState,
    private _location: Location,
    private _router: Router,
    private _route: ActivatedRoute,
    private _cdref: ChangeDetectorRef
  ) {
    this._state.subscribe('menu.isCollapsed', (isCollapsed) => {
      this.isMenuCollapsed = isCollapsed;
    });
  }

  ngOnInit() {
    this.getCurrentPageName();

    this._route.queryParams.subscribe((params) => {
      if (params.hasOwnProperty('selectedTab')) {
        // this.active = Number(params.selectedTab);
        this._cdref.detectChanges();
      } else {
        // this.active = 1;
      }
    });
  }

  public getCurrentPageName(): void {
    const hash = (window.location.hash) ? '#' : '';
    const path = this._router.url.split('?')[0];

    setTimeout(function () {
      const subMenu = jQuery('a[href="' + hash + path + '"]').closest("li").closest("ul");
      window.scrollTo(0, 0);
      subMenu.closest("li").addClass("sidebar-item-expanded");
      subMenu.slideDown(250);
    });
  }

  public hideMenu(): void {
    this._state.notifyDataChanged('menu.isCollapsed', true);
  }

  public ngAfterViewInit(): void {
    if (document.getElementById('preloader')) {
      document.getElementById('preloader').style['display'] = 'none';
    }
  }
}
