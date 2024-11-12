require('dotenv').config();
const AWS = require('aws-sdk');
const fs = require('fs');
AWS.config.update({ region: 'us-east-2',
    accessKeyId: process.env.accessKeyId,
    secretAccessKey: process.env.secretAccessKey
}
);
// Initialize the API Gateway client
const apigateway = new AWS.APIGateway();

// API details
const apiId = 'tqo476u7vj'; // Replace with your API Gateway API ID
const stage = 'test1';   // Replace with your API Gateway stage name (e.g., 'prod')
const exportType = 'swagger'; // 'swagger' or 'oas30' for OpenAPI 3.0

// Define the API export parameters
const params = {
  restApiId: apiId, // The API ID of the API you want to export
  stageName: stage,  // The stage you want to export the Swagger for
  exportType: exportType, // The type of export, either 'swagger' or 'oas30'
  parameters: {
    extensions: 'apigateway' // Include API Gateway-specific extensions
  }
};

// Call the getExport API to retrieve the Swagger definition
apigateway.getExport(params, function (err, data) {
  if (err) {
    console.log("Error exporting Swagger:", err);
  } else {
    // Write the exported Swagger definition to a file
    fs.writeFileSync('swagger.json', JSON.stringify(data.body, null, 2));
    console.log('Swagger exported to swagger.json');
  }
});
