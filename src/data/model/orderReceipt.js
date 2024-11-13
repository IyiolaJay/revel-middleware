import mongoose, { Schema } from "mongoose";

const orderReceiptSchema = new Schema(
  {
    invoiceNumber : {
        type : String,
        required : true,
    },
    distributor_tin: {
      type: String,
      required: true,
    },
    message: {
      type: {
        num: String,
        ysdcid: String,
        ysdcrecnum: String,
        ysdcintdata: String,
        ysdcregsig: String,
        ysdcmrc: String,
        ysdcmrctim: String,
        ysdctime: String,
        flag: String,
        ysdcitems: String,
      },
      required: true,
    },
    qr_code: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const OrderReceipt = mongoose.model("orderReceipts", orderReceiptSchema);

export default OrderReceipt;
