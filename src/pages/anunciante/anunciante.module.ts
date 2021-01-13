import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AnunciantePage } from './anunciante';
import { ReactiveFormsModule } from '@angular/forms';
import { BrMaskerModule } from 'brmasker-ionic-3';

@NgModule({
  declarations: [
    AnunciantePage,
  ],
  imports: [
    IonicPageModule.forChild(AnunciantePage),
    ReactiveFormsModule,
    BrMaskerModule,
  ],
})
export class AnunciantePageModule {}
