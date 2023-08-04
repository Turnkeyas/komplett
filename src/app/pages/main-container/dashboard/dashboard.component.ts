import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { menuItems } from '../../../providers/side-menu';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {

  constructor(private _activatedRoute: ActivatedRoute, private _router: Router) {
    this._activatedRoute.url.subscribe(url => {
      if (!url || !url.length) {
        this._router.navigate(['/' + menuItems[0].routerLink, menuItems[0].subMenu[0].routerLink,
        ]);
      }
    });
  }
}
