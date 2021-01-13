import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MeuscursosPage } from './meuscursos';

@NgModule({
  declarations: [
    MeuscursosPage,       
  ],
  imports: [
    IonicPageModule.forChild(MeuscursosPage),
  ],
})
export class MeuscursosPageModule {}
