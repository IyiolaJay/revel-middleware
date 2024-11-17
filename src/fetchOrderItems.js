import axios from "axios";
import { CalculateAndMapValues } from "./mapToGraData.js";
import { OrderStructure } from "./data/data.js";
import SendOrdersToGRA from "./sendOrders.js";

// Create the authentication string by joining key and secret
const apiAuth = `${process.env.APIKEY}:${process.env.APISECRET}`;

const BASE_URL = process.env.BASE_URL;


// Function to make the request
export default async function fetchOrderItems(orderIds = []) {
    try {
        if (orderIds.length < 1) {
          console.log("Empty orders");
          return;
        }

                
        // Use map to return an array of promises
        const ordersPromises = orderIds.map(async (id) => {
          const URL = `${BASE_URL}/resources/OrderItem/?order=${id.id}`;
          const response = await axios.get(URL, {
            headers: {
              "API-AUTHENTICATION": apiAuth,
              "Content-Type": "application/json",
            },
          });
          
          // CalculateAndMapValues(response.data.objects ?? []);
          let mappedValues = [];
          if(response.data.objects.length > 0){
           //
            const  data =  CalculateAndMapValues(response.data.objects);

            mappedValues = {
              ...OrderStructure,
              invoiceNumber: `${process.env.ENTERPRISE_ACRONYM}${process.env.STATION_ID}-${id.id}`,
              userName : data.userName,
              businessPartnerName : `${process.env.ENTERPRISE_ACRONYM}${process.env.STATION_ID}-CUSTOMER`,
              transactionDate : id.created_date,
              totalAmount : data.totalAmount,
              totalLevy : data.totalLevy,
              totalVat : data.totalVat,
              items : data.items
            
            }
          }
          return mappedValues;
        });
    
        // Use Promise.all to wait for all the promises to resolve
        const allOrderItems = await Promise.all(ordersPromises);
    
        // Flatten the array if needed
        const flattenedItems = allOrderItems.flat();
    
        // console.log("Final Data=", flattenedItems.length);
        
        if (flattenedItems.length > 0 ){
          await SendOrdersToGRA(flattenedItems);
        }

        return;
  } catch (error) {
    console.error("Error:", error);
  }
}
