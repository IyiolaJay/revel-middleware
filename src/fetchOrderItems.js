import axios from "axios";

// Create the authentication string by joining key and secret
const apiAuth = `${process.env.APIKEY}:${process.env.APISECRET}`;

const BASE_URL = process.env.BASE_URL;


// Function to make the request
export default async function fetchOrderItems(orderIds = []) {
    try {
        if (orderIds.length < 1) {
          return;
        }
                
        // Use map to return an array of promises
        const ordersPromises = orderIds.map(async (id) => {
          const URL = `${BASE_URL}/resources/OrderItem/?order=${id}`;
          const response = await axios.get(URL, {
            headers: {
              "API-AUTHENTICATION": apiAuth,
              "Content-Type": "application/json",
            },
          });
    
        //   console.log("Response Api OrderItems====", response.data?.objects.length);
          return response.data?.objects; // Return the order items for each request
        });
    
        // Use Promise.all to wait for all the promises to resolve
        const allOrderItems = await Promise.all(ordersPromises);
    
        // Flatten the array if needed
        const flattenedItems = allOrderItems.flat();
    
        // console.log("Final Data====", flattenedItems);
        
        console.log(flattenedItems.length); // Return the final array of order items
        return;
  } catch (error) {
    console.error("Error:", error);
  }
}
