// server.js
import cluster from 'cluster';
import os from 'os';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const totalCpus = os.cpus().length;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const serverFilePath = `${__dirname}/index.js`; // Path to your index.js file

if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running`);

  // Fork workers based on the number of CPUs available
  for (let i = 0; i < totalCpus; i++) {
    cluster.fork(); // Fork workers
  }
  
  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`);
  });
} else {
  // Workers run the `index.js` server logic
  import(serverFilePath) // Dynamically import the index.js file in the worker
    .then(() => {
      console.log(`Worker ${process.pid} started successfully.`);
    })
    .catch((err) => {
      console.error(`Error in worker ${process.pid}: ${err}`);
    });
}
