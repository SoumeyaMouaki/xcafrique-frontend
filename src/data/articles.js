import axios from 'axios';
import { useEffect, useState } from 'react';

const useArticles = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/articles'); // URL de ton backend
        setArticles(res.data.data); // selon la structure de ton backend
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  return { articles, loading };
};

export default useArticles;
