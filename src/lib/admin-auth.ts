import {createHmac,timingSafeEqual} from "node:crypto";
import {cookies} from "next/headers";

export const ADMIN_COOKIE="itdigest_admin";
const SESSION_SECONDS=8*60*60;
function secret(){return process.env.ADMIN_SESSION_SECRET||""}
export function adminAuthConfigured(){return Boolean(process.env.ADMIN_USERNAME&&process.env.ADMIN_PASSWORD&&secret())}
export function signAdminSession(username:string){const payload=Buffer.from(JSON.stringify({sub:username,exp:Math.floor(Date.now()/1000)+SESSION_SECONDS})).toString("base64url");const signature=createHmac("sha256",secret()).update(payload).digest("base64url");return `${payload}.${signature}`}
export function verifyAdminSession(token:string|undefined){try{if(!token||!secret())return false;const [payload,signature]=token.split(".");if(!payload||!signature)return false;const expected=createHmac("sha256",secret()).update(payload).digest();const actual=Buffer.from(signature,"base64url");if(actual.length!==expected.length||!timingSafeEqual(actual,expected))return false;const data=JSON.parse(Buffer.from(payload,"base64url").toString()) as {sub:string;exp:number};return data.sub===process.env.ADMIN_USERNAME&&data.exp>Math.floor(Date.now()/1000)}catch{return false}}
export async function isAdminAuthenticated(){const jar=await cookies();return verifyAdminSession(jar.get(ADMIN_COOKIE)?.value)}
export const adminSessionSeconds=SESSION_SECONDS;
