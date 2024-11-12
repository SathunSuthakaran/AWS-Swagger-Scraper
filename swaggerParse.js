require('dotenv').config();
const { APIGatewayClient, GetRestApisCommand, GetExportCommand, GetStagesCommand } = require('@aws-sdk/client-api-gateway');

// Initialize API Gateway client
const client = new APIGatewayClient({ region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    }
 });
 const fs = require('fs');

 // Function to retrieve the Swagger (OpenAPI) for a given API ID and stage
 const getSwaggerForApi = async (apiId) => {
   try {
     // Fetch the stages for the API
     const stageCommand = new GetStagesCommand({
       restApiId: apiId,  // The ID of your API
     });
     const stagesData = await client.send(stageCommand);
 
     // Check if stages are available
     if (!stagesData.item || stagesData.item.length === 0) {
       console.log(`No stages found for API ID: ${apiId}`);
       return;
     }
 
     // Assuming the first stage is the one we want (you can adjust if needed)
     const stageName = stagesData.item[0].stageName;
 
     // Retrieve the Swagger export for the given API and stage
     const exportCommand = new GetExportCommand({
       restApiId: apiId,   // The ID of your API
       stageName: stageName,   // Dynamically use the first stage found
       exportType: 'swagger'  // Get Swagger specification
     });
 
     const { body } = await client.send(exportCommand);
 
     // Log the raw response body (binary data)
     console.log("Raw response body (binary data):", body);
 
     // Write the binary data to a file
     const swaggerFileName = `swagger_${apiId}_${stageName}.json`;  // Save as .json file
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
 