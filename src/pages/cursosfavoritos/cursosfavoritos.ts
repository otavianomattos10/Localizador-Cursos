import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CursosProvider } from './../../providers/cursos/cursos';
import { Storage } from '@ionic/storage';
import * as firebase from 'firebase';

/**
 * Generated class for the CursosfavoritosPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-cursosfavoritos',
  templateUrl: 'cursosfavoritos.html',
})
export class CursosfavoritosPage {

  favoritos: any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private storage: Storage,
    private cursosProvider: CursosProvider) {
  }

  ionViewWillEnter() {
    this.buscarCursosFavoritos();
  }

  async buscarCursosFavoritos() {

    try {
      let usuario = await this.storage.get('emailuser');
      this.favoritos = await this.cursosProvider.getMeusCursosFavoritos(usuario);

      for (var index in this.favoritos) {
        //Busco a imagem do curso
        this.buscaImagemCurso(this.favoritos[index].CURSO1 + ' - ' + this.favoritos[index].EMAILUSUARIO + ".jpg", index);
      }

    } catch (error) {
      console.log('erro: ' + error);
    }

  }

  favoritoSelecionado(favoritoSelected: any) {
    this.navCtrl.push("FavoritoselecionadoPage", {
      favoritoSelected
    });
  }

  async buscaImagemCurso(descCurso, index) {
    await firebase.storage().ref().child("/ImagensCursos/" + descCurso).getDownloadURL().then(result => {
      Object.defineProperty(this.favoritos[index], 'IMAGEMCURSO', {
        value: result,
        enumerable: true
      });
    }).catch(error => {
      firebase.storage().ref().child("/ImagensCursos/SemImagem.jpg").getDownloadURL().then(result => {
        Object.defineProperty(this.favoritos[index], 'IMAGEMCURSO', {
          value: result,
          enumerable: true
        });
      })
    });
  }

}
