// backend/scripts/generate-docs.ts

import swaggerJSDoc from 'swagger-jsdoc';
import fs from 'fs';
import path from 'path';
import swaggerOptions from '../src/config/swagger.config';

// Generate the Swagger/OpenAPI specification
const swaggerSpec = swaggerJSDoc(swaggerOptions);

// Define the output directory and file path
const outputDir = path.resolve(process.cwd(), 'docs');
const filePath = path.resolve(outputDir, 'swagger.json');

// Create the directory if it doesn't exist
if (!fs.existsSync(outputDir)){
    fs.mkdirSync(outputDir, { recursive: true });
}

// Write the specification to a file
fs.writeFileSync(filePath, JSON.stringify(swaggerSpec, null, 2));

console.log(`API documentation spec generated at ${filePath}`);
