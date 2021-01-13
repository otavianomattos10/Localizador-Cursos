import { Component } from '@angular/core';
import { NavController, Tabs } from 'ionic-angular';
import { CursosProvider } from './../../providers/cursos/cursos';
import { Events } from 'ionic-angular';

/**
 * Generated class for the FiltrosPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-filtros',
  templateUrl: 'filtros.html',
})
export class FiltrosPage {

  precoCurso: number = 0;
  distCurso: number = 0;
  estadoCurso: any;
  ufdoCurso: any;
  cidades: any;
  cidadedoCurso:any;
  categoria: any;
  categoriadoCurso: any;
  instituicao: any;
  instdoCurso: any;
  descCursos: any;
  curso:any;
  allInf: any;
  HomeParams: any;
  filtroCurso: any;

  tabs: Tabs

  ufLocOpts: { title: string, subTitle: string };
  cityLocOpts: { title: string, subTitle: string };
  categLocOpts: { title: string, subTitle: string };
  instLocOpts: { title: string, subTitle: string };
  cursosLocOpts: { title: string, subTitle: string };

  ionViewDidLoad() {
    this.listaUF();
    this.listaCategoria();
    this.listaCursos();
    this.listaInstituicao();    
  }
  
  constructor( public navCtrl: NavController, public cursosProvider: CursosProvider, public events: Events ) {
    this.ufLocOpts = {
      title: 'Estado',
      subTitle: 'Selecione o estado'      
    };

    this.cityLocOpts = {
      title: 'Cidade',
      subTitle: 'Selecione o município'
    };    

    this.categLocOpts = {
      title: 'Categoria',
      subTitle: 'Selecione a categoria'
    };    

    this.instLocOpts = {
      title: 'Instituições',
      subTitle: 'Selecione a instituição'
    };    

    this.cursosLocOpts = {
      title: 'Cursos',
      subTitle: 'Selecione o curso'
    };    

    this.tabs = this.navCtrl.parent;  

  }  
  
  filtrarCurso() {    

    //Tratamento para as variáveis indefinidas
    if (typeof this.ufdoCurso === "undefined")
      this.ufdoCurso = 'null'

    if (typeof this.cidadedoCurso === "undefined")
      this.cidadedoCurso = 'null'

    if (typeof this.categoriadoCurso === "undefined")
      this.categoriadoCurso = 'null'

    if (typeof this.instdoCurso === "undefined")
      this.instdoCurso = 'null'
      
    if (typeof this.curso === "undefined")
      this.curso = 'null'

    this.filtroCurso = { estado: this.ufdoCurso, 
                          cidade: this.cidadedoCurso,
                          categoria: this.categoriadoCurso,
                          instituicao: this.instdoCurso,
                          preco: this.precoCurso,
                          distancia: this.distCurso,
                          curso: this.curso };

    this.events.publish('event-name', this.filtroCurso);
    this.tabs.select( 1 );

  }

  limparFiltro(){
    this.ufdoCurso = '';
    this.cidadedoCurso = '';
    this.categoriadoCurso = '';
    this.instdoCurso = '';
    this.curso = '';
    this.precoCurso = 0;
    this.distCurso = 0;
  }

  stpSelectUf(ufdoCurso) {    
    this.listaCidades(ufdoCurso);        
  }

  stpSelectCity() {
    //console.log('STP selected');
  }

  stpSelectCateg() {
    //console.log('STP selected');
  }

  stpSelectInst() {
    //console.log('STP selected');
  }

  stpSelectCurso() {
    //console.log('STP selected');
  }

  listaUF(){
    this.cursosProvider.getUF()
    .then( ufCurso => this.estadoCurso = ufCurso );
  }

  listaCategoria(){
    this.cursosProvider.getCategoria()
      .then(
        categoria => { this.categoria = categoria});
  }

  listaCursos(){
    this.cursosProvider.getCursos()
      .then(
        descCursos => { this.descCursos = descCursos});
  }

  listaInstituicao(){
    this.cursosProvider.getInstituicao()
      .then(
        instituicao => { this.instituicao = instituicao});
  }

  
  listaCidades(estadoCurso:string){
    this.cursosProvider.getCidade(estadoCurso)
      .then(
        cidades => { this.cidades = cidades});
  }
  
}
