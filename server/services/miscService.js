import Api409Error from "../utils/errors/api409Error.js";
import Api401Error from "../utils/errors/api401Error.js";
import Api404Error from "../utils/errors/api404Error.js";
import Api500Error from "../utils/errors/api404Error.js";
import pb from "../database/SingletonDB.js";

async function getQuote() {
  let quote = {};
  try {
    const quotes = await pb.collection("quotes").getList();
    quote = quotes.items[0];
  } catch {
    throw new Api404Error("No daily quote set");
  }

  return quote;
}

async function postQuoteService(postQuote, author) {
  try {
    const currentQuotes = await pb.collection("quotes").getList();
    const currentQuoteID = currentQuotes.items[0].id;
    await pb.collection("quotes").update(currentQuoteID, { quote: postQuote, author: author });
  } catch (e) {
    throw new Api500Error("Something went wrong.");
  }
  return true;
}

export { getQuote, postQuoteService };
