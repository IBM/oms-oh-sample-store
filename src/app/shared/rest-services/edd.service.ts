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

/* tslint:disable */

import { Injectable } from '@angular/core';
import { throwError, Observable, of as observableOf } from 'rxjs';
import { map } from 'rxjs/operators';
import { BucCommBEHttpWrapperService } from '@buc/svc-angular';
import { HttpParams } from '@angular/common/http';
import { RestServicesHelper } from './rest-services.helper';


@Injectable()
class EDDService {

    private domain: string
    private resourceDomain: string
    private options: any

    constructor(private http: BucCommBEHttpWrapperService) {
        this.resourceDomain = 'promising';
        this.domain = BucCommBEHttpWrapperService.getPathPrefix(this.resourceDomain);
        this.options = BucCommBEHttpWrapperService.getRequestOptions(this.resourceDomain);
    }

    /**
    * This API will retrieve a list of shipping options based on the passed query parameters.

    * @method
    * @name EDDService#getByTenantIdV1
         * @param {string} itemId - The unique identifier of the item.
         * @param {string} unitOfMeasure - The unit of measure of the item. For example, EACH or CASE.
         * @param {string} productClass - The product class of the item. For example, NEW, USED, or OPEN_BOX.
         * @param {string} destinationFormat - The destinationFormat of the destinationValue.
         * @param {string} destinationValue - The destinationValue to use.
         * @param {string} segment - The segment of the inventory to check.
         * @param {string} segmentType - The segmentType of the inventory to check.
         * @param {string} tenantId - The IBM provided tenant ID to access your APIs.
    */
    public getByTenantIdV1(parameters: {
        'itemId': string,
        'unitOfMeasure': string,
        'productClass': string,
        'destinationFormat': string,
        'destinationValue': string,
        'segment': string,
        'segmentType': string,
        'tenantId': string,
        $queryParameters ? : any,
        $headers ? : any,
        $cache ? : any,
        $refresh ? : any,
        useMocks ? : boolean
    }): Observable < any > {

        let useMocks = false
        if (parameters.useMocks) {
            useMocks = true
        }
        let path = '/v1/{tenantId}/edd'

        const headers = parameters.$headers || {}
        headers['Accept'] = 'application/json';
        headers['Content-Type'] = 'application/json';

        const form = {}
        let body = {}
        const queryParameters = {}

        // allow use of param with or without underscore
        parameters['itemId'] = parameters['itemId'] || parameters['itemId'];

        if (parameters['itemId'] !== undefined) {
            queryParameters['itemId'] = parameters['itemId'];
        }

        if (parameters['itemId'] === undefined) {
            return throwError(new Error('Missing required  parameter: itemId'));
        }

        // allow use of param with or without underscore
        parameters['unitOfMeasure'] = parameters['unitOfMeasure'] || parameters['unitOfMeasure'];

        if (parameters['unitOfMeasure'] !== undefined) {
            queryParameters['unitOfMeasure'] = parameters['unitOfMeasure'];
        }

        if (parameters['unitOfMeasure'] === undefined) {
            return throwError(new Error('Missing required  parameter: unitOfMeasure'));
        }

        // allow use of param with or without underscore
        parameters['productClass'] = parameters['productClass'] || parameters['productClass'];

        if (parameters['productClass'] !== undefined) {
            queryParameters['productClass'] = parameters['productClass'];
        }

        if (parameters['productClass'] === undefined) {
            return throwError(new Error('Missing required  parameter: productClass'));
        }

        // allow use of param with or without underscore
        parameters['destinationValue'] = parameters['destinationValue'] || parameters['destinationValue'];

        if (parameters['destinationValue'] !== undefined) {
            queryParameters['destinationValue'] = parameters['destinationValue'];
        }

        if (parameters['destinationValue'] === undefined) {
            return throwError(new Error('Missing required  parameter: destinationValue'));
        }

        // allow use of param with or without underscore
        parameters['destinationFormat'] = parameters['destinationFormat'] || parameters['destinationFormat'];

        if (parameters['destinationFormat'] !== undefined) {
            queryParameters['destinationFormat'] = parameters['destinationFormat'];
        }

        if (parameters['destinationFormat'] === undefined) {
            return throwError(new Error('Missing required  parameter: destinationFormat'));
        }

        // allow use of param with or without underscore
        parameters['segment'] = parameters['segment'] || parameters['segment'];

        if (parameters['segment'] !== undefined) {
            queryParameters['segment'] = parameters['segment'];
        }

        if (parameters['segment'] === undefined) {
            return throwError(new Error('Missing required  parameter: segment'));
        }

        // allow use of param with or without underscore
        parameters['segmentType'] = parameters['segmentType'] || parameters['segmentType'];

        if (parameters['segmentType'] !== undefined) {
            queryParameters['segmentType'] = parameters['segmentType'];
        }

        if (parameters['segmentType'] === undefined) {
            return throwError(new Error('Missing required  parameter: segmentType'));
        }

        // allow use of param with or without underscore
        parameters['tenantId'] = parameters['tenantId'] || parameters['tenantId'];

        path = path.replace('{tenantId}', parameters['tenantId']);

        if (parameters['tenantId'] === undefined) {
            return throwError(new Error('Missing required  parameter: tenantId'));
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    const parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        const url = this.domain + path;

        if (!headers['Content-Type']) {
            headers['Content-Type'] = 'application/json; charset=utf-8';
        }

        const cached = parameters.$cache && parameters.$cache.get(url);
        if (cached !== undefined && !parameters.$refresh) {
            return observableOf(cached).pipe(map(o => JSON.stringify(o)));
        }

        // need to use our own encoder -- use the helper class' function
        const p: HttpParams = RestServicesHelper.getSupplyDemandParameters(queryParameters);
        const obsToReturn$ = this.http.get(url, this.resourceDomain, p, this.options);

        return obsToReturn$;
    }
}

export {
    EDDService,
}
