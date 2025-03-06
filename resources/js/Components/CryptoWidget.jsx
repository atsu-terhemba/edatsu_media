import { useEffect } from "react";

export default function CryptoWidget(){
    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://public.bnbstatic.com/unpkg/growth-widget/cryptoCurrencyWidget@0.0.20.min.js";
        script.async = true;
        document.body.appendChild(script);
    
        return () => {
          document.body.removeChild(script);
        };
      }, []);

      return(
        <>
        <div class="binance-widget-marquee" data-cmc-ids="1,1027,52,5426,3408,74,2010,5994,20947,24478,13502,35336" data-theme="dark" data-transparent="true" data-locale="en" data-fiat="USD" data-powered-by="Powered by" data-disclaimer="Disclaimer" ></div>
        </>
      )
}