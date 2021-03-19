import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FulfillmentEDDService } from 'src/app/shared/services/fulfillment-edd.service';
import { EDDService } from 'src/app/shared/rest-services/edd.service';
import { CatalogService } from 'src/app/shared/services/catalog-service';
import { CommonModule } from '@angular/common';
import { BucSvcAngularModule, BucSvcAngularStaticAppInfoFacadeUtil } from '@buc/svc-angular';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import {
  BucCommonClassesAllModuleClazz,
  BucCommShellStaticPatternIframeService,
  BucCommBEHttpInterceptorService,
  BucMultiTranslateHttpLoader
} from '@buc/svc-angular';

import { AppComponent } from './app.component';

export class BucCustomOmsBucCustomizationAppModuleBundles {
  static bundles: Array<any> = [{
      prefix: './assets/oms-oh-sample-store/i18n/',
      suffix: '.json'
  }];
}

export function bucCustomOmsBucCustomizationAppModuleHttpLoaderFactory(http: HttpClient) {
  return new BucMultiTranslateHttpLoader(http, BucCustomOmsBucCustomizationAppModuleBundles.bundles);
}
/*
  INFO:
  The content in this class is the recommended content for proper functioning of the application - multi translate loader for i18n,
  interceptor and superclass.
  More content can be added but this must be retained.
*/
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    BucSvcAngularModule.forRoot(),
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
      provide: TranslateLoader,
          useFactory: bucCustomOmsBucCustomizationAppModuleHttpLoaderFactory,
          deps: [HttpClient]
      },
      isolate: true
    }),
    AppRoutingModule,
    NgbModule,
    FormsModule
  ],
  providers: [
    // Any other interceptor added by oms-oh-sample-store to be added before.
    {
      provide: HTTP_INTERCEPTORS,
      useClass: BucCommBEHttpInterceptorService,
      multi: true
    },
    FulfillmentEDDService,
    EDDService,
    CatalogService
  ],
  bootstrap: [AppComponent]
})
export class AppModule extends BucCommonClassesAllModuleClazz {
  constructor(translateService: TranslateService,
              bucCommShellStaticPatternIframeService: BucCommShellStaticPatternIframeService) {
    super(translateService, bucCommShellStaticPatternIframeService);
    /*
      INFO:
      Uncomment to point to any OMS end point for development. It can be customization team's central OMS or local DTK.
      This switch over only activates for a DEV tenant when devMode is set to true for a feature. For all other cases
      and tenants, the configured tenant OMS endpoint will be used. So, no special handling is required for QA, STAGE
      and PROD tenants and the uncommented code can be pushed to git.
    */
    // BucSvcAngularStaticAppInfoFacadeUtil.setLocalDevModeCustomizationTeamOMSUrl('https://localhost:9443/smcfs/');
  }
}
