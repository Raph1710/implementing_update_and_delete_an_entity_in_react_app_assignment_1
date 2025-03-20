import { useState, useEffect } from 'react';
import UpdateItem from "./components/UpdateItem";

// use the following link to get the data
// `/doors` will give you all the doors, to get a specific door use `/doors/1`.
const API_URI = `http://localhost:8000/doors`;

function App() {
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch initial item (using ID 1)
  useEffect(() => {
    const fetchInitialItem = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`${API_URI}/1`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch item: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Fetched data:', data); // Add logging to debug
        setItem(data);
      } catch (error) {
        console.error('Fetch error:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialItem();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return <UpdateItem item={item} itemId="1" />;
}

export default App;
