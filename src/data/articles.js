import { useEffect, useState } from 'react';
import API from '../api';
import { extractApiData } from '../utils/apiHelpers';

const useArticles = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await API.get('/articles');
        const articlesData = extractApiData(res);
        setArticles(articlesData);
      } catch (err) {
        // Erreur silencieuse - l'application peut fonctionner sans articles
        setArticles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  return { articles, loading };
};

export default useArticles;
