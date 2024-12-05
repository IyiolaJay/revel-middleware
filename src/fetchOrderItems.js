import axios from "axios";
import { CalculateAndMapValues } from "./mapToGraData.js";
import { OrderStructure } from "./data/data.js";
import SendOrdersToGRA from "./sendOrders.js";

// Create the authentication string by joining key and secret
const apiAuth = `${process.env.APIKEY}:${process.env.APISECRET}`;

const BASE_URL = process.env.BASE_URL;


// Function to make the request
export default async function fetchOrderItems(orderIds = [], establishment) {
    try {
        if (orderIds.length < 1) {
          console.log("Empty orders");
          return;
        }

                
        // Use map to return an array of promises
        const ordersPromises = orderIds.map(async (id) => {
          const URL = `${establishment.estUrl}/resources/OrderItem/?order=${id.id}`;
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
           
            const userURL = `${establishment.estUrl}/enterprise/User/${data.userId}`;
            
            //call for user details
            const userResponse = await axios.get(userURL, {
              headers: {
                "API-AUTHENTICATION": apiAuth,
                "Content-Type": "application/json",
              },
            });


            mappedValues = {
              ...OrderStructure,
              invoiceNumber: `${process.env.ENTERPRISE_ACRONYM}${establishment.estId}-${id.id}`,
              userName : `${userResponse.data.first_name} ${userResponse.data.last_name}`,
              businessPartnerName : `CUSTOMER-${id.id}`,
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
