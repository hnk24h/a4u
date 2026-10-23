import {isIP} from "node:net";
export function validFeedUrl(value:string){try{const url=new URL(value);return url.protocol==="https:"&&!url.username&&!url.password&&!isIP(url.hostname)&&url.hostname!=="localhost"&&!url.hostname.endsWith(".localhost")&&!url.hostname.endsWith(".local")&&!url.hostname.endsWith(".internal")&&url.hostname.includes(".")}catch{return false}}
