import { Component, OnInit } from '@angular/core';
import { BucSvcAngularStaticAppInfoFacadeUtil, BucBETenantsService } from '@buc/svc-angular';

@Component({
  selector: 'app-dataload',
  templateUrl: './dataload.component.html',
  styleUrls: ['./dataload.component.scss']
})
export class DataloadComponent implements OnInit {
  selectedFile: any;
  fileContent;

  constructor(
    private tenantService: BucBETenantsService
  ) { }

  ngOnInit() {
  }

  async onUpload(event){
    this.selectedFile = event.target.files[0];
    const reader: FileReader = new FileReader();
    reader.readAsText(this.selectedFile, "UTF-8");
    reader.onload = async () => {
        const jsonObj=(JSON.parse(reader.result.toString()));
        this.fileContent = JSON.stringify(jsonObj, null, 0);
        const bodyAttributes = [
            {
              storeId: '0',
              name: 'oh.demo.storefront.productJSON',
              value: this.fileContent
            }
          ];
        const param = {
            tenantId: BucSvcAngularStaticAppInfoFacadeUtil.getSelectedTenantId(),
            body: { attributes: bodyAttributes }
        };
        const test = await this.tenantService.updateTenant(param, null, '/cw/resources', null).toPromise();
    }
  }
}
