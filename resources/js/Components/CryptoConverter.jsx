import { useEffect } from "react";

const CryptoConverterWidget = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/gh/dejurin/crypto-converter-widget@1.5.2/dist/latest.min.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div>
      <crypto-converter-widget
        amount="1"
        shadow="true"
        symbol="true"
        live="true"
        fiat="united-states-dollar"
        crypto="bitcoin"
        font-family="inherit"
        background-color="#1e40af"
        decimal-places="2"
        border-radius="0.5rem"
      ></crypto-converter-widget>
      {/* <a href="https://currencyrate.today/" target="_blank" rel="noopener noreferrer">
        CurrencyRate.Today
      </a> */}
    </div>
  );
};

export default CryptoConverterWidget;
