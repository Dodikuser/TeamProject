import BaseService from "./BaseService";

class PaymentService extends BaseService {
  async completePaypalPayment(orderID) {
    return this.makeRequest("/Payments/paypal/complete", {
      method: "POST",
      body: JSON.stringify(orderID),
    });
  }
}

export default new PaymentService();
