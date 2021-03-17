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
import { EDDService } from '../rest-services/edd.service';
import { BucSvcAngularStaticAppInfoFacadeUtil } from '@buc/svc-angular';

@Injectable()
export class FulfillmentEDDService {
  constructor(private eddSvc: EDDService) {}

  public getEDD(skuId, zipCode, uom?, pClass?) {
      return this.eddSvc.getByTenantIdV1({
        itemId: skuId,
        unitOfMeasure: uom,
        productClass: pClass ? pClass : '',
        destinationFormat: 'POSTAL_CODE',
        destinationValue: zipCode,
        segment: '',
        segmentType: '',
        tenantId: BucSvcAngularStaticAppInfoFacadeUtil.getInventoryTenantId()
      });
  }
}

export interface EDDShippingOptionType {
    carrierService: string;
    result: {
        availableTime: string;
        deliveryTime: string;
        expectedShipTime: string;
        fulfillingNode: string;
        leadTimeUsed: string;
        orderBy: string;
        processingStartTime: string;
        processingTimeUsed: string;
        transitTimeUsed: string;
    }
}

export interface EDDResponseType {
    options: EDDShippingOptionType[];
}
