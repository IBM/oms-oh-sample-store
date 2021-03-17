import { HttpUrlEncodingCodec, HttpParams } from '@angular/common/http';

interface Parameters {
  [key: string]: string;
}

class ValuePipeCodec extends HttpUrlEncodingCodec {
  encodeValue = (v: string) => v;
}

export class RestServicesHelper {
  private static readonly encoder = new ValuePipeCodec();
  public static getSupplyDemandParameters(fromObject: Parameters) {
    Object.keys(fromObject).forEach(k => fromObject[k] = encodeURIComponent(fromObject[k]));
    return new HttpParams({ encoder: this.encoder, fromObject });
  }
}
