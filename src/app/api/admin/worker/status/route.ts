import {NextResponse} from "next/server";
import {isAdminAuthenticated} from "@/lib/admin-auth";
import {ingestQueue} from "@/lib/queue";

type SourceProgress={status:"queued"|"running"|"completed"|"failed";percent:number};

export async function GET(){
  if(!await isAdminAuthenticated())return NextResponse.json({error:"Unauthorized"},{status:401});
  const jobs=await ingestQueue.getJobs(["waiting","active","delayed","failed","completed"],0,50,false);
  const statuses:Record<string,SourceProgress>={};
  for(const job of jobs){
    const jobState=await job.getState();
    const progress=job.progress as {sourceStatuses?:Record<string,SourceProgress>}|number;
    const jobProgress=typeof progress==="object"&&progress!==null?progress.sourceStatuses??{}:{};
    const sourceIds=Array.isArray(job.data.sourceIds)?job.data.sourceIds.map(String):[];
    for(const id of sourceIds){
      if(statuses[id])continue;
      const fallbackStatus=jobState==="active"?"running":jobState==="completed"?"completed":jobState==="failed"?"failed":"queued";
      statuses[id]=jobProgress[id]??{status:fallbackStatus,percent:jobState==="completed"?100:0};
    }
    for(const [id,status] of Object.entries(jobProgress))if(!statuses[id])statuses[id]=status;
  }
  return NextResponse.json({statuses});
}
