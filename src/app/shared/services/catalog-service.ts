// -----------------------------------------------------------------
// Licensed Materials - Property of IBM
//
// 5737-D18
//
// (C) Copyright IBM Corp. 2018, 2019 All Rights Reserved.
//
// US Government Users Restricted Rights - Use, duplication or
// disclosure restricted by GSA ADP Schedule Contract with
// IBM Corp.
// -----------------------------------------------------------------

import { Injectable } from '@angular/core';
import { BucCommOmsRestAPIService,
  BucBEInvAvailabilityService,
  BucSvcAngularStaticAppInfoFacadeUtil
} from '@buc/svc-angular';

@Injectable()
export class CatalogService {
  constructor(
    public bucCommOmsRestAPIService: BucCommOmsRestAPIService,
    public bucBEInvAvailService: BucBEInvAvailabilityService
  ) {}

  public async getItemList(items, uom, enterprise) {
    const payLoad: any = {
        ComplexQuery: { Or: { Exp: items.map(itemId => ({ Name: 'ItemID', QryType: 'EQ', Value: itemId })) } },
        CallingOrganizationCode: enterprise,
        UnitOfMeasure: uom
      };
    
    const response = await this.bucCommOmsRestAPIService.invokeOMSRESTApi('getItemList', payLoad, { templateKey: 'ycm_ui_api_buc_tpl_06' }).toPromise();
    return response;
  }

  public async getItemPrice(items, uom, enterprise, currency) {
    const payLoad: any = { 
      OrganizationCode: enterprise,
      Currency: currency,
      LineItems: {
        LineItem:
          items.map(itemId => ({ ItemID: itemId, Quantity: 1, UnitOfMeasure: uom })),
      }
    };
    
    const response = await this.bucCommOmsRestAPIService.invokeOMSRESTApi('getItemPrice', payLoad, null).toPromise();
    return response;
  }

  public async getDGAvail(itemId, uom, pc, dgId, delMethod) {
    const line: GetNetworkAvailabilityRequestLine = { lineId: itemId, itemId: itemId, unitOfMeasure: uom, productClass: pc, deliveryMethod: delMethod, distributionGroupId: dgId };
    const reqPayload: GetNetworkAvailabilityRequest = { lines: [line], segment: '', segmentType: '', distributionGroupId: dgId }; 
    const response = await this.bucBEInvAvailService.postByTenantIdV1AvailabilityNetwork({
            $queryParameters: { },
            tenantId: BucSvcAngularStaticAppInfoFacadeUtil.getInventoryTenantId(),
            body: reqPayload
          }).toPromise();
    return response;
  }

  public async getNodeAvail(itemId, uom, pc, node, delMethod) {
    const line: GetNodeAvailabilityRequestLine = { lineId: itemId, itemId: itemId, unitOfMeasure: uom, productClass: pc, deliveryMethod: delMethod, shipNodes: node };
    const reqPayload: GetNodeAvailabilityRequest = { lines: [line], segment: '', segmentType: '' }; 
    const response = await this.bucBEInvAvailService.postByTenantIdV1AvailabilityNode({
            $queryParameters: { },
            tenantId: BucSvcAngularStaticAppInfoFacadeUtil.getInventoryTenantId(),
            body: reqPayload
          }).toPromise();
    return response;
  }

}

type GetNodeAvailabilityRequest = {
  'lines': Array < GetNodeAvailabilityRequestLine >
      | GetNodeAvailabilityRequestLine

  'segment' ? : string

  'segmentType' ? : string

};
type GetNodeAvailabilityRequestLine = {
  'lineId': string

  'itemId': string

  'unitOfMeasure': string

  'productClass': string

  'deliveryMethod': "SHP" | "PICK"

  'shipNodes': Array < string >
      | string

};

type GetNetworkAvailabilityRequest = {
  'distributionGroupId': string

  'lines': Array < GetNetworkAvailabilityRequestLine >
      | GetNetworkAvailabilityRequestLine

  'segment' ? : string

  'segmentType' ? : string

};
type GetNetworkAvailabilityRequestLine = {
  'lineId': string

  'itemId': string

  'unitOfMeasure': string

  'productClass': string

  'deliveryMethod': "SHP" | "PICK"

  'distributionGroupId' ? : string

};
