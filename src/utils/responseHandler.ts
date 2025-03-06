import { Response } from 'express';
import { Builder } from 'xml2js';

export class ResponseHandler {
  static sendResponse(res: Response, data: any, status: number = 200) {
    const accept = res.req.headers.accept || 'application/json';

    switch (accept) {
      case 'application/xml':
        res.set('Content-Type', 'application/xml');
        const xml = this.toXML(data);
        return res.status(status).send(xml);
      case 'application/json':
      default:
        res.set('Content-Type', 'application/json');
        return res.status(status).json(data);
    }
  }

  private static toXML(data: any): string {
    const builder = new Builder({
      rootName: 'Secret',
      renderOpts: {
        pretty: true,
        indent: '  ',
        newline: '\n'
      }
    });

    const xmlObj = {
      hash: data.hash,
      secretText: data.secretText,
      createdAt: data.createdAt.toISOString(),
      expiresAt: data.expiresAt ? data.expiresAt.toISOString() : null,
      remainingViews: data.remainingViews
    };

    return builder.buildObject(xmlObj);
  }
}