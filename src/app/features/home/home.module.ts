import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientModule } from '@angular/common/http';
import { HomeRoutingModule } from './home-routing.module';
import { ProductsComponent } from './products/products.component';
import { DetailsComponent } from './products/details/details.component';
import { DataloadComponent } from './dataload/dataload.component';
import { FormsModule } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { TranslateLoader } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import {
  BucCommonClassesAllModuleClazz,
  BucMultiTranslateHttpLoader
} from '@buc/svc-angular';

export class BucCustomOmsBucCustomizationHomeModuleBundles {
  static bundles: Array<any> = [{
    prefix: './assets/oms-oh-sample-store/i18n/',
    suffix: '.json'
  }]; 
}

export function bucCustomOmsBucCustomizationHomeModuleHttpLoaderFactory(http: HttpClient) {
  return new BucMultiTranslateHttpLoader(http, BucCustomOmsBucCustomizationHomeModuleBundles.bundles);
}
/*
  INFO:
  BUC recommends using the multi translate loader for i18n and the superclass for this and every other lazy loaded feature module created
  for proper functioning of the application.
*/
@NgModule({
  declarations: [
    ProductsComponent,
    DetailsComponent,
    DataloadComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: bucCustomOmsBucCustomizationHomeModuleHttpLoaderFactory,
        deps: [HttpClient]
      },
      isolate: true
    }),
    HomeRoutingModule,
    FormsModule
  ],
  exports: [],
  providers: [],
  entryComponents: []
})
export class HomeModule extends BucCommonClassesAllModuleClazz {
  constructor(translateService: TranslateService) {
    super(translateService);
  }
}
