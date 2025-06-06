import BaseService from "./BaseService";

class CurrencyService extends BaseService {
  async getConversionTable() {
    return this.makeRequest("/Payments/conversion-table", {
      method: "GET"
    });
  }
}

export default new CurrencyService();
