// BullMQ workers run as a dedicated process (`npm run worker`). Starting them
// from Next.js instrumentation creates unreliable workers on serverless hosts.
export async function register() {}
