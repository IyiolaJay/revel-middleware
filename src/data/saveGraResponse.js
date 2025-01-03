import axios from "axios";

export default async function saveOrderReceiptToDb(receiptData, establishmentId) {
  try {
    const _receiptMapped = receiptData.map(.env
      (receipt) =>
        ({
          establishmentId : Number(establishmentId),
          orderItems: receipt.orderItems,
          orderReceipt: {
            distributor_tin: receipt.orderReceipt.response.distributor_tin,
            message: receipt.orderReceipt.response.message,
            qr_code: receipt.orderReceipt.response.qr_code,
          },
        })
    );

     axios.put(
      process.env.MAIN_SERVER_URL ?? "",
      {
        items: _receiptMapped
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return;
  } catch (error) {
    console.log(error);
  }
}
