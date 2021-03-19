import { Component, OnInit } from '@angular/core';
import moment from 'moment';
import { CatalogService } from 'src/app/shared/services/catalog-service';
import { FulfillmentEDDService } from 'src/app/shared/services/fulfillment-edd.service';
//import * as data from '../../../../assets/mock-data/products.json';
import { BucSvcAngularStaticAppInfoFacadeUtil } from '@buc/svc-angular';
import { defaultTo } from 'lodash';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  //dataList: any = (data as any).default;
  products: any;
  uom;
  enterpriseCode;
  postalCode;
  pc;
  eddResponse;
  currentDate = new Date();
  currency;
  symbol;

  constructor(
    public catalogService: CatalogService,
    private fulfillmentEddSvc: FulfillmentEDDService
  ) { }

  ngOnInit() {
    this.initialize();
  }

  async initialize() {
    // get item ids that want to be shown in page from JSON saved in tenant attribute
    const attrs = BucSvcAngularStaticAppInfoFacadeUtil.getTenantDetails().attributes;
    const productJSON = JSON.parse(defaultTo(attrs.find(attribute => attribute.name === 'oh.demo.storefront.productJSON').value, '{}'));
    const jsonData = productJSON.ItemList.Item;
    this.uom = productJSON.UnitOfMeasure;
    this.enterpriseCode = productJSON.OrganizationCode;
    this.postalCode = productJSON.PostalCode;
    this.pc = productJSON.ProductClass;
    this.currency = productJSON.Currency;
    this.symbol = productJSON.Symbol;

    // retrive product data from OMS
    const itemIds = [];
    jsonData.forEach(el => { itemIds.push(el.ItemID); });
    const productsResponse = await this.catalogService.getItemList(itemIds, this.uom, this.enterpriseCode);
    this.products = productsResponse.Item;

    // retrieve product prices from OMS
    const productPricesResponse = await this.catalogService.getItemPrice(itemIds, this.uom, this.enterpriseCode, this.currency);
    // insert price to main products object
    this.products.forEach(pMaster => {
      productPricesResponse.LineItems.LineItem.forEach(pPrice => {
        if (pPrice.ItemID === pMaster.ItemID) {
          pMaster.UnitPrice = pPrice.UnitPrice;
        }
      });
    });

    // retrieve EDD with hardcoded postal code and insert into main products object
    this.products.forEach(async pMaster => {
      this.eddResponse = await this.fulfillmentEddSvc.getEDD(pMaster.ItemID, this.postalCode, this.uom, this.pc).toPromise();
      if (this.eddResponse) {
        this._getSortedEDD();
        if (this.eddResponse[0] && this.eddResponse[0].result) {
          pMaster.fastestEDD = this.eddResponse[0];
        } else {
          // insert static demo EDD info
          pMaster.fastestEDD = {
            carrierService: 'Retail Ground',
            resultFound: true,
            result: {
              deliveryTime: new Date((new Date()).getTime() + (5 * 86400000)),
              placeOrderBy: new Date((new Date()).getTime() + (2 * 86400000))
            }
          };
        }
        const firstDate = moment(pMaster.fastestEDD.result.placeOrderBy);
        const secondDate = moment(this.currentDate);
        pMaster.fastestEDD.orderWithin = Math.abs(secondDate.diff(firstDate, 'hours'));
      }
    });
  }
  // API should be returning the fastest, but calculating this in UI for demo
  private _getSortedEDD() {
    const newArr = this.eddResponse.filter(x => x.result);
    this.eddResponse = newArr.sort((a, b) => {
      // Turn your strings into dates, and then subtract them
      // to get a value that is either negative, positive, or zero.
      const dtA = new Date(a.result.deliveryTime).getTime();
      const dtB = new Date(b.result.deliveryTime).getTime();
      return (dtA > dtB) ? 1 : -1;
    });
  }
}
