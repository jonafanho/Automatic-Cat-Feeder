import "reflect-metadata";
import {bootstrapApplication} from "@angular/platform-browser";
import {AppComponent} from "./app/app.component";
import {provideAnimationsAsync} from "@angular/platform-browser/animations/async";
import {provideHttpClient} from "@angular/common/http";
import {provideNativeDateAdapter} from "@angular/material/core";

bootstrapApplication(AppComponent, {providers: [provideAnimationsAsync(), provideHttpClient(), provideNativeDateAdapter()]}).catch(err => console.error(err));
