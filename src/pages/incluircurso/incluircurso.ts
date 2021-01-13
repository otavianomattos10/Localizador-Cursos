import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, normalizeURL } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { Http } from '@angular/http';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { CursosProvider } from './../../providers/cursos/cursos';
import { Storage } from '@ionic/storage';
import * as firebase from 'firebase';

/**
 * Generated class for the IncluircursoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-incluircurso',
  templateUrl: 'incluircurso.html',
})
export class IncluircursoPage {

  public formCurso: FormGroup;
  allCategory: any;
  novaCategoria: boolean = false;
  ListaCategLocOpts: { title: string, subTitle: string };
  imageUpload: any;

  ionViewWillEnter() {
    this.listaCategorias();
  }

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public http: Http,
    private cursosProvider: CursosProvider,
    private fBuilder: FormBuilder,
    private camera: Camera,
    private transfer: FileTransfer,
    private webview: WebView,
    private storage: Storage) {

    this.listaCategorias();

    this.ListaCategLocOpts = {
      title: 'Categoria',
      subTitle: 'Selecione a categoria'
    };

    this.formCurso = this.fBuilder.group({
      'curso': [null, Validators.compose([
        Validators.required,
        Validators.minLength(3)
      ])],
      'descricao': [null, Validators.compose([
        Validators.required
      ])],
      'categoria': [null, Validators.compose([
        Validators.required
      ])],
      'preco': [0.00, Validators.compose([
        Validators.maxLength(10)
      ])],
      'cargahoraria': [null, Validators.compose([
        Validators.maxLength(4)
      ])],
      'vagas': [null, Validators.compose([
        Validators.maxLength(4)
      ])],
      'datainicio': [null, {}],
      'novacategoria': [null, {}],
    });
  }

  uploadImage() {

    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
    }

    this.camera.getPicture(options).then((imageData) => {
      this.imageUpload = 'data:image/jpeg;base64,' + imageData;
    }, (err) => {
      console.log('erro no upload da Imagem: ' + err);
    });
  }

  finalizarCadastro() {

    const confirm = this.alertCtrl.create({
      title: 'Novo Curso',
      message: 'Confirma a inclusão deste curso?',
      buttons: [
        {
          text: 'Não',
          handler: () => {
            console.log('Clique Não');
          }
        },
        {
          text: 'Sim',
          handler: () => {
            this.storage.get('emailuser').then(emailUsuario => {

              let cursoenvio: string;
              let descenvio: string;
              let categenvio: string;
              let precoenvio: number;
              let cargahorariaenvio: string;
              let vagasenvio: string;
              let dataenvio: string;
              let novacategenvio: string;

              if (typeof this.formCurso.value.curso === undefined) {
                cursoenvio = "0";
              } else {
                cursoenvio = this.formCurso.value.curso;
              }

              if (typeof this.formCurso.value.descricao === undefined) {
                descenvio = "0";
              } else {
                descenvio = this.formCurso.value.descricao;
              }

              if (typeof this.formCurso.value.categoria === undefined) {
                categenvio = "0";
              } else {
                categenvio = this.formCurso.value.categoria;
              }

              if (typeof this.formCurso.value.preco === null || this.formCurso.value.preco.length <= 0) {
                precoenvio = 0;
              } else {
                precoenvio = (this.formCurso.value.preco).replace(',', '.');
              }

              if (typeof this.formCurso.value.cargahoraria === undefined) {
                cargahorariaenvio = "0";
              } else {
                cargahorariaenvio = this.formCurso.value.cargahoraria;
              }

              if (typeof this.formCurso.value.vagas === undefined) {
                vagasenvio = "0";
              } else {
                vagasenvio = this.formCurso.value.vagas;
              }

              if (typeof this.formCurso.value.datainicio === undefined) {
                dataenvio = this.formCurso.value.datainicio = "null";
              } else {
                dataenvio = this.formCurso.value.datainicio;
              }

              if (typeof this.formCurso.value.novacategoria === undefined) {
                novacategenvio = "null";
              } else {
                novacategenvio = this.formCurso.value.novacategoria;
              }

              let informacoesCurso = {
                emailUsuario: emailUsuario,
                cursoenvio: cursoenvio,
                descenvio: descenvio,
                categenvio: categenvio,
                precoenvio: precoenvio,
                cargahorariaenvio: cargahorariaenvio,
                vagasenvio: vagasenvio,
                dataenvio: dataenvio,
                novacategenvio: novacategenvio
              };

              if (this.imageUpload != undefined) {                
                //uploads img to firebase storage
                let storageRef = firebase.storage().ref();
                // Create a timestamp as filename
                const filename = informacoesCurso.cursoenvio + ' - ' + informacoesCurso.emailUsuario;

                // Create a reference to 'images/todays-date.jpg'
                const imageRef = storageRef.child('ImagensCursos/' + filename + '.jpg');

                imageRef.putString(this.imageUpload, firebase.storage.StringFormat.DATA_URL)
                  .then((snapshot) => {
                    // Do something here when the data is succesfully uploaded!
                    console.log("Upload com sucesso!");
                  }, error => {
                    console.log(error);
                  });
              }

              this.cursosProvider.salvaNovoCurso(informacoesCurso).then(result => console.log(result));

              const alert = this.alertCtrl.create({
                title: 'Finalizado',
                subTitle: 'As informações do curso adicionado passarão por uma avaliação. Caso atenda os requisitos, ele estará disponível em até 24h, senão, você receberá um e-mail com os problemas deste cadastro',
                buttons: ['OK']
              });
              alert.present();
            });
          }
        }
      ]
    });
    confirm.present();

    this.navCtrl.pop();
  }

  stpSelectCategoria(categSelecionada: any) {
    if (categSelecionada == "OUTRO") {
      this.novaCategoria = true;
      this.formCurso.get('novacategoria').setValidators([Validators.required]);
      this.formCurso.get('novacategoria').updateValueAndValidity();
    } else {
      this.novaCategoria = false;
      this.formCurso.get('novacategoria').clearValidators();
      this.formCurso.get('novacategoria').updateValueAndValidity();
    }
  }

  listaCategorias() {
    this.cursosProvider.getListaCategorias().then(categorias => {
      this.allCategory = categorias;
    });
  }
}
