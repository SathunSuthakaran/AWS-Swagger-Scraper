require('dotenv').config();
const { APIGatewayClient, GetRestApisCommand, GetExportCommand, GetStagesCommand } = require('@aws-sdk/client-api-gateway');

const client = new APIGatewayClient({ region: process.env.AWS_REGION,
    // credentials: {
    //     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    //     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    //     sessionToken: process.env.AWS_SESSION_TOKEN
    // }
 });
 const fs = require('fs');
 
 const getSwaggerForApi = async (apiId) => {
   try {
     // Fetch the stages for the API
     const stageCommand = new GetStagesCommand({
       restApiId: apiId, 
     });
     const stagesData = await client.send(stageCommand);
 
     // Check if stages are available
     if (!stagesData.item || stagesData.item.length === 0) {
       console.log(`No stages found for API ID: ${apiId}`);
       return;
     }
 
     const stageName = stagesData.item[0].stageName;
 

     const exportCommand = new GetExportCommand({
       restApiId: apiId,  
       stageName: stageName,
       exportType: 'swagger'
     });
 
     const { body } = await client.send(exportCommand);
 
     //console.log("Raw response body (binary data):", body);
 

     // Write the json data to a file
     const swaggerFileName = `swagger_${apiId}_${stageName}.json`;
     fs.writeFileSync(swaggerFileName, body); 
 
     console.log(`Swagger data has been saved to ${swaggerFileName}`);
 
   } catch (error) {
     console.error(`Error fetching Swagger for API ID ${apiId}:`, error);
   }
 };
 
 
 const listApisAndGetSwagger = async () => {
   try {
    
     const command = new GetRestApisCommand({});
     const data = await client.send(command);
 
     if (!data.items || data.items.length === 0) {
       console.log('No APIs found.');
       return;
     }
 
     // For each API, fetch the Swagger 
     for (const api of data.items) {
       console.log(`Fetching Swagger for API: ${api.name} (ID: ${api.id})`);
       await getSwaggerForApi(api.id);
     }
   } catch (error) {
     console.error('Error fetching APIs:', error);
   }
 };
 
 //need to add loop for stages
 listApisAndGetSwagger();
 