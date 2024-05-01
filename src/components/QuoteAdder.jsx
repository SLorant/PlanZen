import axios from "axios";

const QuoteAdder = ({ setAuthor, setQuote }) => {
  //Fetch new quote from api
  const addNewQuote = async () => {
    try {
      let quote = await fetchNewQuote();
      while (quote.quote.length > 80) {
        quote = await fetchNewQuote();
      }
      const postQuote = quote.quote;
      const author = quote.author;

      await axios.post(
        `${import.meta.env.VITE_LIVE_SERVER}/newquote`,
        {
          postQuote,
          author,
        },
        {
          withCredentials: true,
        }
      );
      setQuote(quote.quote);
      setAuthor(quote.author);
    } catch (error) {
      console.error(error);
    }
  };

  //Fetch quote from db
  const fetchDailyQuote = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_LIVE_SERVER}/dailyquote`, {
        withCredentials: true,
      });
      const quote = response.data;
      //Check if quote was uploaded today or not
      const date = new Date(quote.updated);
      const today = new Date();
      const isNotToday =
        date.getFullYear() !== today.getFullYear() ||
        date.getMonth() !== today.getMonth() ||
        date.getDate() !== today.getDate();
      if (isNotToday) {
        addNewQuote();
      } else {
        setQuote(quote.quote);
        setAuthor(quote.author);
      }
    } catch (e) {
      console.log(import.meta.env.VITE_LIVE_SERVER);
      console.log(e);
    }
  };

  //Fetch new quote from api
  const fetchNewQuote = async () => {
    try {
      const res = await fetch("https://api.api-ninjas.com/v1/quotes?category=inspirational", {
        headers: {
          "X-Api-Key": import.meta.env.VITE_QUOTES_API_KEY,
        },
      });
      const quotes = await res.json();
      const quote = quotes[0];
      console.log(quote);
      return quote;
    } catch {
      setQuote("A wizard is never late, nor is he early, he arrives precisely when he means to");
      setAuthor("Gandalf");
    }
  };

  fetchDailyQuote();
};

export default QuoteAdder;
