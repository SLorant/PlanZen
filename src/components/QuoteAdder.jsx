import axios from "axios";

const QuoteAdder = ({ setAuthor, setQuote }) => {
  const addNewQuote = async () => {
    try {
      let quote = await fetchNewQuote();
      while (quote.quote.length > 100) {
        quote = await fetchNewQuote();
      }
      const postQuote = quote.quote;
      const author = quote.author;
      await axios.post(
        "http://localhost:4000/newquote",
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

  const fetchDailyQuote = async () => {
    try {
      const response = await axios.get("http://localhost:4000/dailyquote", {
        withCredentials: true,
      });
      const quote = response.data;
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
      // Get the day of the week (0 for Sunday, 1 for Monday, ..., 6 for Saturday)
    } catch (e) {
      console.log(e);
    }
  };

  const fetchNewQuote = async () => {
    try {
      const res = await fetch(
        "https://api.api-ninjas.com/v1/quotes?category=inspirational",
        {
          headers: {
            "X-Api-Key": import.meta.env.VITE_QUOTES_API_KEY,
          },
        }
      );
      const quotes = await res.json();
      const quote = quotes[0];
      console.log(quote);
      return quote;
    } catch {
      setQuote("asd");
    }
  };

  fetchDailyQuote();
};

export default QuoteAdder;
