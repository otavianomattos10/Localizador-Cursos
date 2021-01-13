import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { CursosProvider } from './../../providers/cursos/cursos';
import * as firebase from 'firebase';

/**
 * Generated class for the MeuscursosPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-meuscursos',
  templateUrl: 'meuscursos.html',
})
export class MeuscursosPage {

  cursos: any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private storage: Storage,
    private cursosProvider: CursosProvider,
    public alertCtrl: AlertController) { }

  ionViewWillEnter() {
    this.buscarCursosInstituicao();
  }

  async buscarCursosInstituicao() {

    try {
      let usuario = await this.storage.get('emailuser');      
      this.cursos = await this.cursosProvider.getMeusCursos(usuario);

      for (var index in this.cursos) {
        //Busco a imagem do curso
        this.buscaImagemCurso(this.cursos[index].CURSO1 + ' - ' + this.cursos[index].EMAILUSUARIO + ".jpg", index);
      }

    } catch (error) {
      console.log('erro: ' + error);
    }

  }

  ionViewDidLoad() { }

  incluirCurso(event: any) {

    //Verifico primeiro se o usuário preencheu todas as 
    //suas informações antes de incluir um novo curso    
    this.storage.get('emailuser').then(emailUsuario => {
      this.cursosProvider.buscaUsuario(emailUsuario).then(dadosCadastrais => {
        if (dadosCadastrais[0].NOMECOMPLETO === null) {
          this.showAlert();          
        } else {
          this.navCtrl.push("IncluircursoPage", {});
        }
      })
    });
  }

  cursoSelecionado(cursoSelected: any) {
    this.navCtrl.push("MeucursoselecionadoPage", {
      cursoSelected
    });
  }

  showAlert() {
    const alert = this.alertCtrl.create({
      title: 'Atenção!',
      subTitle: 'Preencha todas as suas informações no seu perfil antes de continuar',
      buttons: ['Ok']
    });
    alert.present();
  }

  async buscaImagemCurso(descCurso, index) {
    await firebase.storage().ref().child("/ImagensCursos/" + descCurso).getDownloadURL().then(result => {
      Object.defineProperty(this.cursos[index], 'IMAGEMCURSO', {
        value: result,
        enumerable: true
      });
    }).catch(error => {
      firebase.storage().ref().child("/ImagensCursos/SemImagem.jpg").getDownloadURL().then(result => {
        Object.defineProperty(this.cursos[index], 'IMAGEMCURSO', {
          value: result,
          enumerable: true
        });
      })
    });
  } 

}
