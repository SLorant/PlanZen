import PocketBase from "pocketbase";

const url = process.env.DATABASE_URL;
const url2 = "http://127.0.0.1:8090";
const pb = new PocketBase(url);
export default pb;
