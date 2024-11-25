import { OrderItemStructure } from "./data/data.js";
import { calculateAllTaxesAndLeviesForAnItem } from "./taxAndLevisCalculator.js";

export function CalculateAndMapValues (orderItems = []){
    if (orderItems.length < 1) return {
        totalAmount :  0.0,
          totalLevy :  0.0,
          items : [],
    };


    let totalVat = 0;
    let totalLevy = 0;
    let totalAmount = 0;
    let userId;
    
    //
    const calculateValues = orderItems.map(item => {
        const dues = calculateAllTaxesAndLeviesForAnItem(item);
        
        //get total levy
        totalLevy += (dues.allLevies * item.quantity)
        
        //get total tax
        totalVat = totalVat + (dues.vatPerItem * item.quantity);

        //
        totalAmount = totalAmount + (dues.unitPrice * item.quantity);
        
        userId = item.created_by.split("/")[3] ?? "";
        
        return {
            ...OrderItemStructure,
            itemCode : item.uuid + "221",
            levyAmountA : dues.levyAmountA * item.quantity,
            levyAmountB : dues.levyAmountB * item.quantity,
            levyAmountC : dues.levyAmountC * item.quantity,
            levyAmountE : dues.levyAmountE * item.quantity,
            description : item.product_name_override,
            quantity : item.quantity,
            unitPrice : dues.unitPrice,
        };
    })

    
    // console.log("structure", {
    //     totalAmount : totalAmount.toFixed(1),
    //     items : calculateValues
    // });

    return {
        totalAmount : parseFloat(totalAmount.toFixed(2)),
        totalLevy : totalLevy,
        totalVat : totalVat,
        userId : userId,
        items : calculateValues
    }
}