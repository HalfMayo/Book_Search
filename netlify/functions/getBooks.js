import axios from 'axios'
//TODO: import.meta.env??
export const handler = async (event) => {
    try {
      console.log(import.meta)
      const { topic, index } = event.queryStringParameters;
      const realIndex = (index - 1) * 10;
      const apiKey = process.env.VITE_GOOGLEBOOKS_KEY;
      let response = await axios.get(
        `https://www.googleapis.com/books/v1/volumes?q=${topic}&startIndex=${realIndex}&maxResults=10&projection=lite&key=${apiKey}`,
        {
          headers: { Accept: "application/json", "Accept-Encoding": "identity" },
        }
      );
      const data = await response.data.items;
  
      return {
        statusCode: 200,
        body: JSON.stringify({ data }),
      };
    } catch (error) {
      console.log(error)
      return {
        statusCode: 500,
        body: JSON.stringify({ error }),
      };
    }
  };