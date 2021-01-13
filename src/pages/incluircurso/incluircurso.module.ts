import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { IncluircursoPage } from './incluircurso';
import { ReactiveFormsModule } from '@angular/forms';
import { BrMaskerModule } from 'brmasker-ionic-3';

@NgModule({
  declarations: [
    IncluircursoPage,
  ],
  imports: [
    IonicPageModule.forChild(IncluircursoPage),
    ReactiveFormsModule,
    BrMaskerModule
  ],
})
export class IncluircursoPageModule {}
