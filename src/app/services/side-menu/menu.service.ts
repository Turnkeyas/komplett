import { Injectable } from '@angular/core';
import { menuItems } from '../../providers/side-menu';

@Injectable()
export class SideMenuService {

  public getMenuItems(): Array<Object> {
    return menuItems;
  }
}
