import { Component } from '@angular/core';
import { NavController, NavParams, IonicPage } from 'ionic-angular';
import { CursosProvider } from './../../providers/cursos/cursos';
import { Storage } from '@ionic/storage';
import * as firebase from 'firebase';

/**
 * Generated class for the DetalhesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-detalhes',
  templateUrl: 'detalhes.html',
})
export class DetalhesPage {

  cursos: any;
  cursoSelecionado: any;
  dadosCurso = {
    idCurso: 0,
    tituloCurso: '',
    emailUsuario: ''
  }
  outrosCursos: any;
  resultado: any;
  cursoFavorito: boolean = false;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    private cursosProvider: CursosProvider,
    private storage: Storage,) {
    
  }

  ionViewWillEnter() {
    this.cursos = this.navParams.get('evento');  
    this.cursoSelecionado = this.cursos.CURSO1;      

    //busco os dados para favoritar ou desfavoritar
    this.storage.get('emailuser').then(emailUser => {
      this.dadosCurso.idCurso = this.cursos.ID;
      this.dadosCurso.tituloCurso = this.cursoSelecionado;
      this.dadosCurso.emailUsuario = emailUser;

      //Verifico se o curso é favorito deste usuário
      this.cursosProvider.checkCursoFavorito(this.dadosCurso).then(checkFavorito => {
        
        if(Object.keys(checkFavorito).length > 0){
          this.cursoFavorito = true;
        } else {
          this.cursoFavorito = false;
        }
        
      })

    });

    this.buscarCursosInstituicao();    
    this.resultado = Array.of(this.cursos);
  }

  buscarCursosInstituicao(){    
    //Busco outros cursos da instituição clicada
    this.cursosProvider.getCursosInst(this.cursos)
    .then(outrosCursos => { 
      this.outrosCursos = outrosCursos 

      for (var index in this.outrosCursos) {
        //Busco a imagem do curso
        this.buscaImagemCurso(this.outrosCursos[index].CURSO1 + ' - ' + this.outrosCursos[index].EMAILUSUARIO + ".jpg", index);
      }

    });    
  }

  clickCard(event){
    this.navCtrl.push("DetalhesPage", {
      evento: event
    });
  }

  favoritarCurso(){
    this.cursoFavorito = !this.cursoFavorito;   
    
    if(this.cursoFavorito){
      this.cursosProvider.favoritarCurso(this.dadosCurso);      
    } else {
      this.cursosProvider.desfavoritarCurso(this.dadosCurso);      
    }
  }

  async buscaImagemCurso(descCurso, index) {
    await firebase.storage().ref().child("/ImagensCursos/" + descCurso).getDownloadURL().then(result => {
      Object.defineProperty(this.outrosCursos[index], 'IMAGEMCURSO', {
        value: result,
        enumerable: true
      });
    }).catch(error => {
      firebase.storage().ref().child("/ImagensCursos/SemImagem.jpg").getDownloadURL().then(result => {
        Object.defineProperty(this.outrosCursos[index], 'IMAGEMCURSO', {
          value: result,
          enumerable: true
        });
      })
    });
  }  
}
