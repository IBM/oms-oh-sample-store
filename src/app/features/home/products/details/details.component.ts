import { Component, OnInit } from '@angular/core';
import { CatalogService } from 'src/app/shared/services/catalog-service';
import { FulfillmentEDDService } from 'src/app/shared/services/fulfillment-edd.service';
import { ActivatedRoute } from '@angular/router';
//import * as data from '../../../../../assets/mock-data/products.json';
import { BucSvcAngularStaticAppInfoFacadeUtil } from '@buc/svc-angular';
import { defaultTo } from 'lodash';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {
  item: any;
  isInitialized = false;
  itemId: any;
  categories = [];
  isPickup = true;
  qty = 5;

  // dataList: any = (data as any).default;
  uom;
  enterpriseCode;
  postalCode;
  pc;
  product;
  eddResponse;
  currency;
  symbol;

  // IV availability
  shipNode;
  distributionGroupId;
  delMethod;
  availQtyAtDG = 0;
  availQtyAtNode = 0;

  constructor(
    private catalogService: CatalogService,
    private fulfillmentEddSvc: FulfillmentEDDService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.initialize();
  }

  async initialize() {
    this.itemId = this.route.snapshot.params.id;
    // get item ids that want to be shown in page from JSON saved in tenant attribute
    const attrs = BucSvcAngularStaticAppInfoFacadeUtil.getTenantDetails().attributes;
    const productJSON = JSON.parse(defaultTo(attrs.find(attribute => attribute.name === 'oh.demo.storefront.productJSON').value, '{}'));
    this.uom = productJSON.UnitOfMeasure;
    this.enterpriseCode = productJSON.OrganizationCode;
    this.postalCode = productJSON.PostalCode;
    this.pc = productJSON.ProductClass;
    this.currency = productJSON.Currency;
    this.symbol = productJSON.Symbol;
    this.distributionGroupId = productJSON.DistributionGroupId;
    this.delMethod = productJSON.DeliveryMethod;
    
    const productsResponse = await this.catalogService.getItemList([this.itemId], this.uom, this.enterpriseCode);
    this.product = productsResponse.Item[0];
    this.categories = this.product.CategoryList.Category.map(c => c.CategoryID);
    this.isInitialized = true;

    // retrieve product price from OMS
    const productPricesResponse = await this.catalogService.getItemPrice([this.itemId], this.uom, this.enterpriseCode, this.currency);
    // insert price to main products object
    this.product.UnitPrice = productPricesResponse.LineItems.LineItem[0].UnitPrice;

    // retrieve DG availability from IV
    const ivresponseDG = await this.catalogService.getDGAvail(this.itemId, this.uom, this.pc, this.distributionGroupId, this.delMethod);
    this.availQtyAtDG = ivresponseDG.lines[0].networkAvailabilities[0].onhandAvailableQuantity;
  }

  async getEDD() {
    this.eddResponse = await this.fulfillmentEddSvc.getEDD(this.itemId, this.postalCode, this.uom, this.pc).toPromise();
    this._getSortedEDD();

    const newArr = this.eddResponse.filter(x => x.result);
    if (newArr) {
      this.shipNode = newArr[0].result.fulfillingNode;
    }
    
    const ivresponse = await this.catalogService.getNodeAvail(this.itemId, this.uom, this.pc, [this.shipNode], this.delMethod);
    this.availQtyAtNode = ivresponse.lines[0].shipNodeAvailability[0].onhandAvailableQuantity;
  }

  setPickupActive(flag) {
    this.isPickup = flag;
  }

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
