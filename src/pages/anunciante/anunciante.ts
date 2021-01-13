import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController  } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { CursosProvider } from './../../providers/cursos/cursos';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the AnunciantePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-anunciante',
  templateUrl: 'anunciante.html',
})
export class AnunciantePage {

  public formCadastro: FormGroup;
  ufLocOpts: { title: string, subTitle: string };
  cidadeLocOpts: { title: string, subTitle: string };
  ufSelected: any;
  estadoCurso: any;
  cidadeCurso: any;
  dadosCadastrais = {
    id: 0,
    nome: '',
    endereco: '',
    numerolocal: '',
    bairro: '',
    cidade: '',
    estado: '',
    telefone: '',
    celular: '',
    whatsapp: '',
    email: '',
    site: '',
    cep: '',
    uf: ''
  }

  ionViewWillEnter() {
    //Carrega os dados do usuário cadastrado
    this.loadUserData();
  }

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public cursosProvider: CursosProvider,
    public toastCtrl: ToastController,
    private fBuilder: FormBuilder,
    private storage: Storage) {

    this.ufLocOpts = {
      title: 'Estado',
      subTitle: 'Selecione o estado'
    };

    this.cidadeLocOpts = {
      title: 'Cidade',
      subTitle: 'Selecione o município'
    };

    //Carrega os dados do usuário cadastrado    
    this.loadUserData();

    this.formCadastro = this.fBuilder.group({
      'nome': [this.dadosCadastrais.nome, Validators.compose([
        Validators.required,
        Validators.minLength(3)
      ])],
      'endereco': [this.dadosCadastrais.endereco, Validators.compose([
        Validators.required,
        Validators.minLength(3)
      ])],
      'numerolocal': [this.dadosCadastrais.numerolocal, Validators.required],
      'bairro': [this.dadosCadastrais.bairro, Validators.compose([
        Validators.required,
        Validators.minLength(3)
      ])],
      'cidade': [this.dadosCadastrais.cidade, Validators.required],
      'estado': [this.dadosCadastrais.estado, Validators.required],
      'telefone': [this.dadosCadastrais.telefone, {}],
      'celular': [this.dadosCadastrais.celular, {}],
      'whatsapp': [this.dadosCadastrais.whatsapp, {}],
      'cep': [this.dadosCadastrais.bairro, Validators.compose([
        Validators.required,
        Validators.minLength(9),
        Validators.maxLength(9)
      ])],
      'site': [this.dadosCadastrais.site, {}],
      'email': [this.dadosCadastrais.email, Validators.compose([
        Validators.required,
        Validators.email
      ])]
    });
  }

  async onSubmit() {
    // aqui você pode implementar a logica para fazer seu formulário salvar      
    this.dadosCadastrais[0].NOME = this.formCadastro.value.nome;
    this.dadosCadastrais[0].ENDERECO = this.formCadastro.value.endereco;
    this.dadosCadastrais[0].NUMEROLOCAL = this.formCadastro.value.numerolocal;
    this.dadosCadastrais[0].BAIRRO = this.formCadastro.value.bairro;
    this.dadosCadastrais[0].CIDADE = this.formCadastro.value.cidade;
    this.dadosCadastrais[0].ESTADO = this.formCadastro.value.estado;
    this.dadosCadastrais[0].TELEFONE = this.formCadastro.value.telefone;
    this.dadosCadastrais[0].CELULAR = this.formCadastro.value.celular;
    this.dadosCadastrais[0].WHATSAPP = this.formCadastro.value.whatsapp;
    this.dadosCadastrais[0].EMAILCOMERCIAL = this.formCadastro.value.email;
    this.dadosCadastrais[0].WEBSITE = this.formCadastro.value.site;
    this.dadosCadastrais[0].CEP = this.formCadastro.value.cep;
    this.dadosCadastrais[0].UF = this.ufSelected;
    try {
      let result = await this.cursosProvider.salvaCadastroUsuario(this.dadosCadastrais);
      this.presentToast();
    } catch (error) {
      console.log(error);
    }
  }

  async loadUserData() {
    try {
      let emailUsuario = await this.storage.get('emailuser');
      this.dadosCadastrais = await this.cursosProvider.buscaUsuario(emailUsuario);
      this.formCadastro.get('nome').setValue(this.dadosCadastrais[0].NOMECOMPLETO);
      this.formCadastro.get('endereco').setValue(this.dadosCadastrais[0].ENDERECO);
      this.formCadastro.get('numerolocal').setValue(this.dadosCadastrais[0].NUMEROLOCAL);
      this.formCadastro.get('bairro').setValue(this.dadosCadastrais[0].BAIRRO);
      this.formCadastro.get('cidade').setValue(this.dadosCadastrais[0].CIDADE);
      this.formCadastro.get('estado').setValue(this.dadosCadastrais[0].ESTADO);
      this.formCadastro.get('telefone').setValue(this.dadosCadastrais[0].TELEFONE);
      this.formCadastro.get('celular').setValue(this.dadosCadastrais[0].CELULAR);
      this.formCadastro.get('whatsapp').setValue(this.dadosCadastrais[0].WHATSAPP);
      this.formCadastro.get('email').setValue(this.dadosCadastrais[0].EMAILCOMERCIAL);
      this.formCadastro.get('site').setValue(this.dadosCadastrais[0].WEBSITE);
      this.formCadastro.get('cep').setValue(this.dadosCadastrais[0].CEP);

      this.listaUF(this.dadosCadastrais[0].ESTADO);
    } catch (error) {
      console.log(error);
    }
  }

  listaUF(estadoSelecionado: any) {
    this.cursosProvider.getEstados()
      .then(estado => {
        this.estadoCurso = estado;
        let selectedCategory = this.estadoCurso.filter(item => item.NOME == estadoSelecionado)[0];
        
        if(typeof selectedCategory != "undefined"){
          this.listaCidades(selectedCategory.CODIGO_UF);
        }
        
      });
  }

  stpSelectUf(ufdoCurso) {
    this.ufSelected = ufdoCurso.UF;
    this.listaCidades(ufdoCurso.CODIGO_UF);
  }

  stpSelectCity() {
    //console.log('STP selected');
  }

  listaCidades(estadoCurso?: string) {
    this.cursosProvider.getMunicipio(estadoCurso)
      .then(cidade => {
        this.cidadeCurso = cidade
      });
  }

  presentToast() {
    const toast = this.toastCtrl.create({
      message: 'Cadastro salvo com sucesso!',
      duration: 2000
    });
    toast.present();
  }

}
