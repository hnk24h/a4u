import {startWorker,stopWorker} from "./worker";

let stopping=false;
async function shutdown(signal:string){
  if(stopping)return;
  stopping=true;
  console.log(`Received ${signal}; closing IT Digest workers`);
  try{await stopWorker();process.exit(0)}catch(error){console.error("Worker shutdown failed",error);process.exit(1)}
}

process.once("SIGINT",()=>void shutdown("SIGINT"));
process.once("SIGTERM",()=>void shutdown("SIGTERM"));

startWorker().catch(async error=>{
  console.error("IT Digest worker failed to start",error);
  try{await stopWorker()}catch(shutdownError){console.error("Worker cleanup failed",shutdownError)}
  process.exit(1);
});
