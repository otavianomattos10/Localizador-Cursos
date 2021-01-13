import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams, Events } from 'ionic-angular';
import { CursosProvider } from './../../providers/cursos/cursos';
import * as L from "leaflet";
import 'leaflet.awesome-markers/dist/leaflet.awesome-markers.js';

@Component({
  selector: 'page-mapa',
  templateUrl: 'mapa.html',
})
export class MapaPage {

  @ViewChild('myMap') mapContainer: ElementRef;
  public center: L.PointTuple;
  map: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public cursosProvider: CursosProvider, public events: Events) {

  }

  ionViewWillEnter() {
    this.center = [-29.691484, -53.812409];
    this.events.subscribe('envio-getall', (allInf) => { this.leafletMap(allInf) });
  }

  ionViewWillLeave() {          
    this.events.unsubscribe('envio-getall')
  }

  leafletMap(allInf?: any) {

    if (this.map) {
      this.map.remove();
    }

    // criando o marcados do usuário
    var userMarker = L.AwesomeMarkers.icon({
      icon: 'user',
      markerColor: 'blue',
      prefix: 'fa',
      spin: false
    });

    //Extensão da classe para tratar multiplas aberturas
    L.Map = L.Map.extend({
      openPopup: function (popup) {
        this._popup = popup;
        return this.addLayer(popup).fire('popupopen', {
          popup: this._popup
        });
      }
    });    

    this.map = L.map('myMap', {
      center: this.center,
      zoom: 17
    });

    //Localização atual - Web
    this.map.locate({
      setView: true,
      maxZoom: 10
    }).on('locationfound', (e) => {
      this.map.setView([e.latitude, e.longitude], 13);
      let markerGroup = L.featureGroup();
      let markerUser: any = L.marker([e.latitude, e.longitude], { icon: userMarker }).addTo(this.map);
      markerUser.bindPopup("<b>Estou aqui</b><br>", { autoClose: false, closeOnClick: false }).openPopup();
      markerGroup.addLayer(markerUser);
      this.map.addLayer(markerGroup);
    })

    var position = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'NETZ Art Soluções em Internet © LeafLet'
    }).addTo(this.map);

    //criando os marcadores dos anuncios
    for (var index in allInf) {
      /*
      var anuncioMarker = L.AwesomeMarkers.icon({
        icon: allInf[index].ICONE.toLowerCase(),
        markerColor: 'green',
        prefix: 'fa',
        spin: false  
      });
      */
      
      var anuncioMarker = L.icon({
        //iconUrl: '../../assets/img/' + allInf[index].INSTITUICAO + '.jpg',
        iconUrl: allInf[index].IMAGEMCURSO,
        //shadowUrl: '../../assets/img/' + allInf[index].INSTITUICAO + '.jpg',

        iconSize: [58, 65], // size of the icon
        //shadowSize: [50, 64], // size of the shadow
        iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
        shadowAnchor: [4, 62],  // the same for the shadow
        popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
      });

      this.center = [allInf[index].LATITUDE, allInf[index].LONGITUDE]
      var marker = new L.Marker(this.center, { icon: anuncioMarker }).addTo(this.map);
      marker.bindPopup("<p>" + allInf[index].INSTITUICAO + "</p>", { closeOnClick: false, autoClose: false }).openPopup();
    }
  }
}