require('dotenv').config();
const { APIGatewayClient, GetRestApisCommand, GetExportCommand } = require('@aws-sdk/client-api-gateway');

// Initialize API Gateway client
const client = new APIGatewayClient({ region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    }
 });
 const fs = require('fs');
 // Function to retrieve Swagger (OpenAPI) for a given API ID
 const getSwaggerForApi = async (apiId) => {
   try {
     // Retrieve the Swagger export for the given API
     const command = new GetExportCommand({
       restApiId: apiId,   // The ID of your API
       stageName: 'prod',   // Replace with your API's stage (e.g., 'prod', 'dev')
       exportType: 'swagger'  // Get Swagger specification
     });
 
     const { body } = await client.send(command);
 
     // Log the raw response body to inspect its contents (should be binary data)
     console.log("Raw response body (binary data):", body);
 
     // Write the binary data to a file
     const swaggerFileName = `swagger_${apiId}.json`;  // Save as .json file
     fs.writeFileSync(swaggerFileName, body);  // Write the binary data to a file
 
     console.log(`Swagger data has been saved to ${swaggerFileName}`);
 
   } catch (error) {
     console.error(`Error fetching Swagger for API ID ${apiId}:`, error);
   }
 };
 
 // Function to list all APIs and fetch their Swagger definitions
 const listApisAndGetSwagger = async () => {
   try {
     // List all REST APIs
     const command = new GetRestApisCommand({});
     const data = await client.send(command);
 
     if (!data.items || data.items.length === 0) {
       console.log('No APIs found.');
       return;
     }
 
     // For each API, fetch the Swagger definition
     for (const api of data.items) {
       console.log(`Fetching Swagger for API: ${api.name} (ID: ${api.id})`);
       await getSwaggerForApi(api.id);
     }
   } catch (error) {
     console.error('Error fetching APIs:', error);
   }
 };
 
 // Call the function to list APIs and get Swagger
 listApisAndGetSwagger();
 