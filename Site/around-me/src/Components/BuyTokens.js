import React, { useEffect, useState } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import CurrencyService from "../services/CurrencyService";
import UserService from "../services/UserService";
import PaymentService from "../services/PaymentService";

const CLIENT_ID = "AeQe82Q9Z9YPEh9L3ZoqsvNYdPuAQ61qSHFzuvB7XPTQfKquo_noNSKGi0rI4eSRk2PRDTApTsWRv6zn"; // Замените на ваш реальный client id

function BuyTokens() {
  const [conversion, setConversion] = useState(null);
  const [currency, setCurrency] = useState("USD");
  const [amount, setAmount] = useState(1); // теперь amount — сумма денег, которую хочет потратить пользователь
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tokensAvailable, setTokensAvailable] = useState(null);

  useEffect(() => {
    async function fetchConversion() {
      setIsLoading(true);
      try {
        const data = await CurrencyService.getConversionTable();
        setConversion(data);
        // Выбрать первую валюту по умолчанию
        const first = Object.keys(data).find(k => k !== "$id");
        setCurrency(first || "USD");
      } catch (e) {
        setError("Ошибка загрузки курсов валют");
      } finally {
        setIsLoading(false);
      }
    }
    fetchConversion();
  }, []);

  useEffect(() => {
    async function fetchUserData() {
      try {
        const userData = await UserService.getUserData();
        if (userData && typeof userData.TokensAvailable !== 'undefined') {
          setTokensAvailable(userData.TokensAvailable);
        }
      } catch (e) {
        // ignore
      }
    }
    fetchUserData();
  }, []);

  if (isLoading) return <div>Загрузка...</div>;
  if (error) return <div>{error}</div>;
  if (!conversion) return <div>Нет данных о валютах</div>;

  const handleAmountChange = e => setAmount(Number(e.target.value));
  const handleCurrencyChange = e => setCurrency(e.target.value);

  // rate = сколько токенов за 1 валюту
  const rate = conversion[currency] || 1;
  const tokens = Math.floor(amount * rate); // сколько токенов получит пользователь

  const handleApprove = (data, actions) => {
    return actions.order.capture().then(details => {
      const orderId = data.orderID || details.id;
      console.log("PayPal orderId:", orderId, "data:", data, "details:", details);
      PaymentService.completePaypalPayment(orderId)
        .then(() => {
          alert("Оплата прошла успешно!");
        })
        .catch(e => {
          alert("Ошибка при подтверждении оплаты: " + e.message);
        });
    });
  };

  return (
    <PayPalScriptProvider key={currency} options={{ "client-id": CLIENT_ID, currency }}>
      <div style={{ maxWidth: 400, margin: "0 auto" }}>
        <h3>Купівля токенів</h3>
        <div>
          <label>Валюта: <b>EUR</b></label>
        </div>
        <div>
          <label>Сума до оплати:
            <input type="number" min={0.01} step={0.01} value={amount} onChange={handleAmountChange} /> EUR
          </label>
        </div>
        <div>Ви отримаєте: <b>{tokens}</b> токенів</div>
        <div style={{ marginTop: 20 }}>
          <PayPalButtons
            style={{ layout: "vertical" }}
            createOrder={(data, actions) => {
              return actions.order.create({
                purchase_units: [{
                  amount: { value: amount.toFixed(2), currency_code: currency }
                }]
              });
            }}
            onApprove={handleApprove}
          />
        </div>
      </div>
    </PayPalScriptProvider>
  );
}

export default BuyTokens;
