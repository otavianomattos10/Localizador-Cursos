import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { CursosProvider } from './../../providers/cursos/cursos';

/**
 * Generated class for the MeucursoselecionadoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-meucursoselecionado',
  templateUrl: 'meucursoselecionado.html',
})
export class MeucursoselecionadoPage {

  cursoSelecionado: any;
  curso: any;
  resultado: any;
  exclusao: any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private alertCtrl: AlertController,
    private cursosProvider: CursosProvider) {
  }

  ionViewDidLoad() { }

  ionViewWillEnter() {
    this.curso = this.navParams.get('cursoSelected');
    this.cursoSelecionado = this.curso.CURSO1;
    this.resultado = Array.of(this.curso);    
  }

  excluirCurso(result: any) {
    const confirm = this.alertCtrl.create({
      title: 'Atenção',
      message: 'Deseja realmente excluir este curso?',
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
      this.exclusao = await this.cursosProvider.desativarCurso(result.ID); 
      this.navCtrl.pop();
    } catch (error) {
      console.log('erro exclusão: ' + error);
    }    
  }

}
