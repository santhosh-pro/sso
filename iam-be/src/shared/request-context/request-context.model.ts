import { AsyncLocalStorage } from 'async_hooks';

export class RequestContext<TRequest = any, TResponse = any> {
  static cls = new AsyncLocalStorage<RequestContext>();

  static get currentContext() {
    return this.cls.getStore();
  }

  static get fullBaseUrl() {
    const req = this.currentContext?.req;
    const host = req.get('host');
    const protocol =
      req.get('x-forwarded-proto') === 'https' ? 'https' : 'http';
    return `${protocol}://${host}`;
  }

  static get fullUrl() {
    const req = this.currentContext?.req;
    const host = req.get('host');
    const hostUrl = `${req.protocol}://${host}${req.originalUrl}`;
    return hostUrl;
  }

  constructor(
    public readonly req: TRequest,
    public readonly res: TResponse,
  ) {}
}
