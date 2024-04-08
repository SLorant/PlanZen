import { getQuote, postQuoteService } from "../services/miscService.js";

const getDailyQuote = async (req, reply) => {
  try {
    const quote = await getQuote();
    reply.code(200).send(quote);
  } catch (e) {
    reply.code(e.status).send(e.name);
  }
};

const postQuote = async (req, reply) => {
  const { postQuote, author } = req.body;

  try {
    const isSuccess = await postQuoteService(postQuote, author);
    isSuccess ? reply.code(200).send("Success") : reply.code(500).send("Something went wrong.");
  } catch (e) {
    reply.code(e.status).send(e.name);
  }
};

export { getDailyQuote, postQuote };
