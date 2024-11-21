import axios from "axios";
import saveOrderReceiptToDb from "./data/saveGraResponse.js";

export default async function SendOrdersToGRA(mappedOrders = []) {
  if (mappedOrders.length < 1) return;
 
  /**
   * 
   */
  const receipts = mappedOrders.map(async (order) => {
    const headers = {
      "Content-Type": "application/json",
      security_key: process.env.GRA_SECURITY_KEY,
    };
    const config = {
      headers: headers,
      maxBodyLength: Infinity,
    };

    const URL = process.env.GRA_URL;
    const response = await axios.post(URL, order, config);

    // console.log("Receipt response",response.data)

    //
    return {
            // ...response.data,
            // invoiceNumber : order.invoiceNumber,
            orderItems : order,
            orderReceipt : {
              ...response.data
            }
            };
  });


  const _receipts = await Promise.all(receipts);
  //save order receipts to order table in db
  saveOrderReceiptToDb(_receipts);
  return;
}
