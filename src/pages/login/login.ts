import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import firebase from 'firebase';
import { TabsPage } from '../tabs/tabs';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { Platform } from 'ionic-angular';
import { CursosProvider } from './../../providers/cursos/cursos';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook/ngx';
import { Http } from '@angular/http';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  private loading: any;
  userdata: string;

  facebook = {
    loggedIn: false,
    name: '',
    email: '',
    profilePicture: ''
  };

  google = {
    loggedIn: false,
    name: '',
    email: ''
  };

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private afauth: AngularFireAuth,
    private googlePlus: GooglePlus,
    private fb: Facebook,
    private cursosProvider: CursosProvider,
    private http: Http,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private storage: Storage) {
  }

  async loginFacebook() {

    let authFace: string;

    await this.presentLoading();

    await this.fb.login(['public_profile', 'email'])
      .then((res: FacebookLoginResponse) => {
        if (res.status === 'connected') {
          authFace = res.authResponse.accessToken;

          const facebookCredential = firebase.auth.FacebookAuthProvider
            .credential(res.authResponse.accessToken);

          firebase.auth().signInWithCredential(facebookCredential)
            .then(success => {
              console.log("Firebase success");
            });

        } else {
          this.presentToast('Login Failed');;
        }
      })
      .catch(error => { 
        this.presentToast('Erro ao logar no Facebook. Tente Novamente.');
        this.loading.dismiss(); 
      });

    if (authFace.length > 0) {
      await this.getData(authFace);
    }

    //Aguardo o login do Facebook para tratar a tabspage.
    if (this.facebook.loggedIn) {
      this.storage.set('nameuser', this.facebook.name);
      this.storage.set('emailuser', this.facebook.email);
      this.cursosProvider.salvaUsuario(this.facebook.name, this.facebook.email);
      //Busco todos os dados desse usuário no banco
      this.buscaDadosUsuario(this.facebook.email);
      this.navCtrl.setRoot(TabsPage);
      this.loading.dismiss();
    } else {
      console.log("Login Failed");
      this.loading.dismiss();
    }
  }

  async loginGoogle() {

    await this.presentLoading();

    const dadosUser = await this.googlePlus.login({
      'scopes': '',
      'webClientId': '705001666760-6qjtn3ek7hdcsceae5h6mvhigsenq08f.apps.googleusercontent.com',
      'offline': true
    }).catch(err => { 
      this.presentToast(err.message);
      this.loading.dismiss();
    });

    await firebase.auth().signInWithCredential(firebase.auth.GoogleAuthProvider.credential(dadosUser.idToken))
      .then(success => {
        this.google.loggedIn = true;
        this.google.name = dadosUser.displayName;
        this.google.email = dadosUser.email;
      }).catch(error => { 
        this.presentToast(error.message);
        this.loading.dismiss();
      });

    //Aguardo o login do Google para tratar a tabspage.    
    if (this.google.loggedIn) {
      this.storage.set('nameuser', this.google.name);
      this.storage.set('emailuser', this.google.email);
      this.cursosProvider.salvaUsuario(this.google.name, this.google.email);
      //Busco todos os dados desse usuário no banco
      this.buscaDadosUsuario(this.google.email);     
      this.navCtrl.setRoot(TabsPage);
      this.loading.dismiss();
    } else {
      console.log("Login Failed");
      this.loading.dismiss();
    }
  }

  async getData(access_token: string) {
    let url = 'https://graph.facebook.com/me?fields=id,name,first_name,last_name,email&access_token=' + access_token;
    return await this.http.get(url)
      .map(res => res.json())     // Get the body of the response
      .toPromise()                // Convert the observable into a promise
      .then(
        response => {           // Success callback            
          this.facebook.loggedIn = true;
          this.facebook.email = response.email;
          this.facebook.name = response.name;
        },
        error => {              // Error callback
          //alert('error: ' + error);
          this.presentToast(error.message);
        });
  };

  async presentLoading() {
    this.loading = await this.loadingCtrl.create({ content: 'Por favor, aguarde...' });
    await this.loading.present();
  }

  presentToast(message: string) {
    let toast = this.toastCtrl.create({
      message,
      duration: 2000,
      position: 'bottom'
    });
    
    toast.present();
  }

  buscaDadosUsuario(emailUsuario){
    this.cursosProvider.buscaUsuario(emailUsuario).then( response => {
      this.storage.set('idUser', response.ID);
      this.storage.set('nomeCompleto', response.NOMECOMPLETO);
      this.storage.set('endereco', response.ENDERECO);
      this.storage.set('numerolocal', response.NUMEROLOCAL);
      this.storage.set('bairro', response.BAIRRO);
      this.storage.set('cidade', response.CIDADE);
      this.storage.set('estado', response.ESTADO);
      this.storage.set('pais', response.PAIS);
      this.storage.set('telefone', response.TELEFONE);
      this.storage.set('celular', response.CELULAR);
      this.storage.set('whatsapp', response.WHATSAPP);
      this.storage.set('emailcomercial', response.EMAILCOMERCIAL);
    })   
  }

}