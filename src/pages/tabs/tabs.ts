import { Component } from '@angular/core';

import { MapaPage } from '../mapa/mapa';
import { FiltrosPage } from '../filtros/filtros';
import { HomePage } from '../home/home';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  public tab1Root: any;
  public tab2Root: any;
  public tab3Root: any;

  constructor() {

    this.tab1Root = FiltrosPage;
    this.tab2Root = HomePage;
    this.tab3Root = MapaPage;

  }
}
