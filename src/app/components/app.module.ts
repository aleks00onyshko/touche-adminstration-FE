import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedMaterialModule } from './shared-material.module';
import { BannerComponent } from '../banner/banner.component';

@NgModule({
  declarations: [ BannerComponent],
  imports: [BrowserModule, BrowserAnimationsModule, SharedMaterialModule],
  providers: [],
  
})
export class AppModule {}
