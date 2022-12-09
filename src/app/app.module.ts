import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CoreUIModule } from '@epsilon/core-ui';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {SampleModelComponent} from "./sample-model/sample-model.component";
import {ReactiveFormsModule} from "@angular/forms";
import { CodeFormatComponent } from './code-format/code-format.component';
// import { CoreUIDataVizModule } from '@epsilon/core-ui/data-viz';


@NgModule({
  declarations: [
    AppComponent,SampleModelComponent, CodeFormatComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CoreUIModule,
    ReactiveFormsModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
