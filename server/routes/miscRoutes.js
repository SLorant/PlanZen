import { getDailyQuote, postQuote } from "../controllers/miscController.js";
import Quote from "../models/Quote.js";
import Message from "../models/Message.js";
import { loginUser } from "../controllers/authController.js";

const getQuoteOpts = {
  schema: {
    response: {
      500: Message,
      404: Message,
      200: Quote,
    },
  },
  handler: getDailyQuote,
};

const postQuoteOpts = {
  schema: {
    body: Quote,
    response: {
      500: Message,
      404: Message,
      401: Message,
      200: Message,
    },
  },
  handler: postQuote,
};

const miscRoutes = (app, options, done) => {
  //Get all
  app.get("/dailyquote", getQuoteOpts);

  app.post("/newquote", postQuoteOpts);

  done();
};

export { miscRoutes };
