import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Events, App, Slides } from 'ionic-angular';
import { CursosProvider } from './../../providers/cursos/cursos';
import { LoginPage } from '../login/login';
import { AngularFireAuth } from 'angularfire2/auth';

import * as firebase from 'firebase';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  @ViewChild(Slides) slides: Slides;

  allInf: any;
  allPublicidades: any;
  latitudeUser: any;
  longitudeUser: any;
  distCurso: any;
  noRegisters: string;
  filtroUser: any;

  ionViewDidLoad() { }

  ionViewWillEnter() {

    if (typeof this.filtroUser != "undefined") {
      this.listaCursos(this.filtroUser);
    } else {
      this.listaTudo();
    }

    this.events.subscribe('event-name', (filtroCurso) => { this.listaCursos(filtroCurso) });

    setTimeout(() => {
      this.slides.autoplay = 2000;
      this.slides.speed = 500;
      this.slides.loop = true;
      this.slides.pager = true;
      this.slides.startAutoplay();
    }, 5000)

  }

  ionViewDidLeave() {
    this.slides.stopAutoplay();
    this.events.publish('envio-getall', this.allInf);
  }

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public cursosProvider: CursosProvider,
    public events: Events,
    public appCtrl: App,
    private afauth: AngularFireAuth,
    private storage: Storage) {

    this.listaTudo();
    this.listaPublicidade();
  }

  async listaCursos(filtroCurso?: any) {

    this.filtroUser = filtroCurso;
    await this.cursosProvider.getCursosFilt(filtroCurso)
      .then(allInf => {
        this.allInf = allInf;

        for (var index in this.allInf) {
          this.buscaImagemCurso(this.allInf[index].CURSO1 + ' - ' + this.allInf[index].EMAILUSUARIO + ".jpg", index);
        }
      })

    if (Object.keys(this.allInf).length <= 0) {
      this.noRegisters = 'Nenhum registro encontrado! :(';
    } else {
      this.noRegisters = '';
    }

    setTimeout(() => {
      this.slides.autoplay = 2000;
      this.slides.speed = 500;
      this.slides.loop = true;
      this.slides.pager = true;
      this.slides.startAutoplay();
    }, 5000)

  }

  async listaTudo() {

    setTimeout(() => {
      this.slides.autoplay = 2000;
      this.slides.speed = 500;
      this.slides.loop = true;
      this.slides.pager = true;
      this.slides.startAutoplay();
    }, 5000)

    this.cursosProvider.getAll()
      .then(allInf => {
        this.allInf = allInf;

        for (var index in this.allInf) {
          this.buscaImagemCurso(this.allInf[index].CURSO1 + ' - ' + this.allInf[index].EMAILUSUARIO + ".jpg", index);
        }
      })
  }

  listaPublicidade() {

    this.cursosProvider.getPublicidade()
      .then(allPublicidades => {
        this.allPublicidades = allPublicidades

        for (var index in this.allPublicidades) {

          //Busco a imagem do curso
          try {
            Object.defineProperty(this.allPublicidades[index], 'IMAGEMPUBLICIDADE', {
              value: firebase.storage().ref().child("/Publicidades/" + this.allPublicidades[index].INSTITUICAO + ".jpg").getDownloadURL(),
              enumerable: true
            });
          }
          catch (e) {
            console.log(e);
          }
        }

      })
  }

  clickCard(event) {
    this.navCtrl.push("DetalhesPage", {
      evento: event
    });
  }

  logOut(e) {
    this.afauth.auth.signOut();
    this.appCtrl.getRootNav().setRoot(LoginPage);
  }

  async buscaImagemCurso(descCurso, index) {
    await firebase.storage().ref().child("/ImagensCursos/" + descCurso).getDownloadURL().then(result => {
      Object.defineProperty(this.allInf[index], 'IMAGEMCURSO', {
        value: result,
        enumerable: true
      });
    }).catch(error => {
      firebase.storage().ref().child("/ImagensCursos/SemImagem.jpg").getDownloadURL().then(result => {
        Object.defineProperty(this.allInf[index], 'IMAGEMCURSO', {
          value: result,
          enumerable: true
        });
      })
    });
  }

}
