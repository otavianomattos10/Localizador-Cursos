import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { CursosProvider } from './../../providers/cursos/cursos';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the FavoritoselecionadoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-favoritoselecionado',
  templateUrl: 'favoritoselecionado.html',
})
export class FavoritoselecionadoPage {

  favoritoSelecionado: any;
  resultado: any;
  favorito: any;
  exclusao: any;
  dadosCurso = {
    idCurso: 0,
    tituloCurso: '',
    emailUsuario: ''
  }

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,    
    private alertCtrl: AlertController,
    private cursosProvider: CursosProvider,
    private storage: Storage) {
  }

  ionViewWillEnter() {
    this.favorito = this.navParams.get('favoritoSelected');
    this.favoritoSelecionado = this.favorito.CURSO1;
    
    //busco os dados para favoritar ou desfavoritar
    this.storage.get('emailuser').then(emailUser => {
      this.dadosCurso.idCurso = this.favorito.ID;
      this.dadosCurso.tituloCurso = this.favoritoSelecionado;
      this.dadosCurso.emailUsuario = emailUser;
    });

    this.resultado = Array.of(this.favorito);    
  }

  excluirFavorito(result: any) {
    const confirm = this.alertCtrl.create({
      title: 'Atenção',
      message: 'Deseja realmente excluir este curso dos seus favoritos?',
      buttons: [
        {
          text: 'Não',
          handler: () => {
            console.log('Não confirma');
          }
        },
        {
          text: 'Sim',
          handler: () => {
            this.confirmaExclusao(result);            
          }
        }
      ]
    });
    confirm.present();
  }

  async confirmaExclusao(result:any){
    try {
      await this.cursosProvider.desfavoritarCurso(this.dadosCurso); 
      this.navCtrl.pop();
    } catch (error) {
      console.log('erro exclusão: ' + error);
    }    
  }

}
