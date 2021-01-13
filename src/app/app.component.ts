import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { App } from 'ionic-angular';

import { LoginPage } from '../pages/login/login';
import { AnunciantePage } from '../pages/anunciante/anunciante';
import { TabsPage } from '../pages/tabs/tabs';
import { SplitPane } from '../providers/split-pane/split-pane';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  rootPage:any;

  constructor( public splitPane : SplitPane, 
    public app: App,
    private storage: Storage ) {

      this.storage.get('emailuser').then( emailUser => {
        if(emailUser != null){
          this.rootPage = TabsPage;
        } else {
          this.rootPage = LoginPage;
        }
      });
      
    }

  faleConosco(){
    this.app.getActiveNav().push("ContatoPage");
  }

  meuPerfil(){
    this.app.getActiveNav().push("AnunciantePage");
  }  

  cursosFavoritos(){
    this.app.getActiveNav().push("CursosfavoritosPage");
  }  
  
  meusCursos(){
    this.app.getActiveNav().push("MeuscursosPage");
  }    
}
