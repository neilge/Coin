import config from '../config';
import '../shim.js';
import crypto from 'crypto';

export default class GeminiApiCaller {

  constructor(geminiApiKey, secret) {
    this.geminiApiKey = geminiApiKey;
    this.secret = secret;
    const subdomain = config.sandbox ? `api.sandbox` : `api`;
    this.baseUrl = `https://${subdomain}.gemini.com`;
  }

  // public api

  // public request template
  // return a Promise
  _publicRequest(endpoint, params = {}) {
    return fetch(`${this.baseUrl}/v1${endpoint}`, params).then(response => response.json());
  }

  // get Ticker by symbol
  getTickerBySymbol(symbol) {
    return this._publicRequest(`/pubticker/${symbol}`);
  }

  // private api

  // private request template
  // return a Promise
  _privateRequest(endpoint, params = {}) {
    if (!this.geminiApiKey || !this.secret) {
      throw new Error('API key and secret key required to use authenticated methods');
    }

    const payload = {
      request: `/v1${endpoint}`,
      nonce: Date.now()
    };
    params.headers = this._getRequestHeaders(payload);
    params.method = 'POST';

    return fetch(`${this.baseUrl}/v1${endpoint}`, params).then(response => response.json());
  }

  // get request header
  _getRequestHeaders(payload) {
    const b64 = (new Buffer(JSON.stringify(payload))).toString('base64');
    const signature = crypto.createHmac('sha384', this.secret).update(b64).digest('hex');
    return {
      'Content-Type': 'text/plain',
      'Content-Length': '0',
      'Cache-Control': 'no-cache',
      'X-GEMINI-APIKEY': this.geminiApiKey,
      'X-GEMINI-PAYLOAD': b64,
      'X-GEMINI-SIGNATURE': signature
    }
  }

  // get all the avaliable balances
  getAvailableBalance() {
    return this._privateRequest('/balances');
  }
}
