import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeDatePipe } from './safe-date.pipe';
import { SafeHtmlPipe } from './safe-html.pipe';

@NgModule({
  imports: [
    CommonModule,
    SafeDatePipe
  ],
  declarations: [
    SafeHtmlPipe
  ],
  exports: [
    SafeDatePipe,
    SafeHtmlPipe
  ]
})
export class PipesModule { }
