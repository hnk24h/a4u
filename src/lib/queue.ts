import {Queue} from "bullmq";import IORedis from "ioredis";
export const connection=new IORedis(process.env.REDIS_URL??"redis://localhost:6379",{maxRetriesPerRequest:null});
const defaultJobOptions={attempts:5,backoff:{type:"exponential" as const,delay:30000},removeOnComplete:true,removeOnFail:{count:500}};
export const ingestQueue=new Queue("rss-ingest",{connection,defaultJobOptions});export const processingQueue=new Queue("article-process",{connection,defaultJobOptions});export const digestQueue=new Queue("digest-generate",{connection,defaultJobOptions});
