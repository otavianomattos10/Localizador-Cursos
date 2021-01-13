import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { HttpModule } from '@angular/http';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth'
import { AngularFireDatabaseModule } from 'angularfire2/database'
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { Facebook } from '@ionic-native/facebook/ngx';
import { HTTP } from '@ionic-native/http/ngx';
import { ReactiveFormsModule } from '@angular/forms';
import { BrMaskerModule } from 'brmasker-ionic-3';
import { IonicStorageModule } from '@ionic/storage';
import { Camera } from '@ionic-native/camera/ngx';
import { File } from '@ionic-native/file/ngx';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';

import { FiltrosPage } from '../pages/filtros/filtros';
import { MapaPage } from '../pages/mapa/mapa';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { CursosProvider } from '../providers/cursos/cursos';
import { LoginPage } from '../pages/login/login';
import { SplitPane } from '../providers/split-pane/split-pane';

var firebaseConfig = {
  apiKey: "AIzaSyAlwSL75b7Vn9lNWToQ1_dPA3riHSqz-wA",
  authDomain: "study-246621.firebaseapp.com",
  databaseURL: "https://study-246621.firebaseio.com",
  projectId: "study-246621",
  storageBucket: "study-246621.appspot.com",
  messagingSenderId: "705001666760",
  appId: "1:705001666760:web:9fef8f1476140b42"
};

@NgModule({
  declarations: [
    MyApp,
    MapaPage,
    FiltrosPage,
    HomePage,
    TabsPage,
    LoginPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp,{tabsHideOnSubPages: true}),
    IonicStorageModule.forRoot(),
    HttpModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    ReactiveFormsModule,
    BrMaskerModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    FiltrosPage,
    MapaPage,
    HomePage,
    TabsPage,
    LoginPage
  ],
  providers: [
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    Geolocation,
    CursosProvider,
    SplitPane,
    GooglePlus,
    Facebook,
    HTTP,
    File,
    FileTransfer,
    Camera,
    FilePath,
    WebView
  ]
})
export class AppModule {}