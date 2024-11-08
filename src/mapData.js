import { OrderItemStructure, OrderStructure } from "./data/data.js";
import { calculateAllTaxesAndLeviesForAnItem, roundToTargetPrecision } from "./taxAndLevisCalculator.js";

export function CalculateAndMapValues (orderItems = []){
    if (orderItems.length < 1) return {
        totalAmount :  0.0,
          totalLevy :  0.0,
          items : [],
    };


    let totalVat = 0;
    let totalLevy = 0;
    let totalAmount = 0;
    let userName;
    
    //
    const calculateValues = orderItems.map(item => {
        const levies = calculateAllTaxesAndLeviesForAnItem(item);
        
        //get total levy
        totalLevy = totalLevy + levies.allDues
        
        //get total tax
        totalVat = totalVat + levies.VAT;

        //
        totalAmount = totalAmount + item.pure_sales;
        
        userName = item.created_by.split("/")[3] ?? "";

        return {
            ...OrderItemStructure,
            itemCode : item.uuid,
            levyAmountA : levies.levyAmountA,
            levyAmountB : levies.levyAmountB,
            levyAmountC : levies.levyAmountC,
            levyAmountE : levies.levyAmountE,
            description : item.product_name_override,
            quantity : item.quantity,
            unitPrice : item.pure_sales,
        };
    })

    
    // console.log("structure", {
    //     totalAmount : totalAmount.toFixed(1),
    //     items : calculateValues
    // });

    return {
        totalAmount : totalAmount.toFixed(1),
        totalLevy : totalLevy.toFixed(2),
        totalVat : totalVat.toFixed(1),
        userName : `${process.env.ENTERPRISE_ACRONYM}${process.env.STATION_ID}-${userName}`,
        items : calculateValues
    }
}