import OrderReceipt from "./model/orderReceipt.js";

export default async function saveOrderReceiptToDb(receiptData){
    try{
        
        const _receiptMapped = receiptData.map(receipt => new OrderReceipt({
            invoiceNumber : receipt.invoiceNumber,
            distributor_tin : receipt.response.distributor_tin,
            message : receipt.response.message,
            qr_code : receipt.response.qr_code
        }))

        //
        // return;
        await OrderReceipt.bulkSave(_receiptMapped);
        
        console.log("Saved to Db");
        return;
    }catch(error){
        console.log(error);
    }
}