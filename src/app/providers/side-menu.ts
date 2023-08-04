import { USERROLES } from '../core/constants/constants';

export const divisionMenu = [
  {
    title: 'All',
    routerLink: 'all',
    value: 'All',
  },
  {
    title: 'Bad',
    routerLink: 'bath',
    value: 'Bath',
  },
  {
    title: 'Vaskerom',
    routerLink: 'laundry-room',
    value: 'LaundryRoom',
  },
  {
    title: 'WC',
    routerLink: 'WC',
    value: 'WC',
  },
  {
    title: 'Kjøkken',
    routerLink: 'kitchen',
    value: 'Kitchen',
  },
  {
    title: 'Soverom',
    routerLink: 'bed-room',
    value: 'BedRoom',
  },
  {
    title: 'Stue',
    routerLink: 'living-room',
    value: 'LivingRoom',
  },
  {
    title: 'Bod',
    routerLink: 'bod',
    value: 'Bod',
  },
];

export const processMenu = [
  {
    title: 'Prosjektering',
    routerLink: 'engineering',
    index: 0,
    value: 'Engineering',
  },
  {
    title: 'Conteiner leie',
    routerLink: 'container-rent',
    index: 1,
    value: 'ContainerRent',
  },
  {
    title: 'Tildeking',
    routerLink: 'coverage',
    index: 2,
    value: 'Coverage',
  },
  {
    title: 'Riving',
    routerLink: 'demolition',
    index: 3,
    value: 'Demolition',
  },
  {
    title: 'Tømrerarbeid',
    routerLink: 'carpentry',
    index: 4,
    value: 'Carpentry',
  },
  {
    title: 'Membranarbeider',
    routerLink: 'membrane-worker',
    index: 5,
    value: 'Membraneworker',
  },
  {
    title: 'Mur,puss og flisarbeid',
    routerLink: 'wall-plaster-and-tile-work',
    index: 6,
    value: 'WallPlasterAndTileWork',
  },
  {
    title: 'Rørarbeider',
    routerLink: 'rorar-beider',
    index: 7,
    value: 'RorarBeider',
  },
  {
    title: 'Elektroarbeid',
    routerLink: 'electrical-work',
    index: 8,
    value: 'Electricalwork',
  },
  {
    title: 'Tømrerarbeider',
    routerLink: 'carpenters-work',
    index: 9,
    value: 'Tømrerarbeider',
  },
];

export const menuItems = [
  {
    title: 'Goal',
    routerLink: 'goal',
    icon: 'fa-laptop',
    selected: false,
    expanded: false,
    order: 300,
    subMenu: divisionMenu.map((item) => {
      return {
        title: item.title,
        routerLink: '',
        subMenu: processMenu.map((subitem) => {
          return {
            title: subitem.title,
            routerLink: `goal/${item.routerLink}/${subitem.routerLink}`,
          };
        }),
      };
    }),
  },
  {
    title: 'Mail',
    routerLink: 'mail/mail-list/inbox',
    icon: 'fa-envelope-o',
    selected: false,
    expanded: false,
    order: 330,
  },
  {
    title: 'Calendar',
    routerLink: 'calendar',
    icon: 'fa-calendar',
    selected: false,
    expanded: false,
    order: 350,
  },
  {
    title: 'Master Material',
    routerLink: 'master-material',
    icon: 'fa-table',
    selected: false,
    expanded: false,
    order: 360,
    subMenu: processMenu,
  },
  {
    title: 'Administration',
    routerLink: 'administration',
    icon: 'fa-address-book-o',
    selected: false,
    expanded: false,
    order: 370,
    authority: [USERROLES.SUPER_ADMIN],
    subMenu: [
      {
        title: 'Users',
        routerLink: 'users',
        value: 'users',
      },
      {
        title: 'Fags',
        routerLink: 'fags',
        value: 'fags',
      },
      {
        title: 'Company Settings',
        routerLink: 'company-settings',
        value: 'CompanySettings',
      },
      {
        title: 'Surcharge',
        routerLink: 'surcharge',
        value: 'Surcharge',
      },
      {
        title: 'Material Groups',
        routerLink: 'material-groups',
        value: 'MaterialGroups',
      },
    ],
  },
  {
    title: 'Tilbudmal',
    routerLink: 'offer-template',
    icon: 'fa-file',
    selected: false,
    expanded: false,
    order: 340,
  },
  {
    title: 'legge til selskap',
    routerLink: 'material-groups',
    icon: 'fa-plus',
    selected: false,
    expanded: false,
    order: 340,
  },
];
