import { useEffect, useState } from 'react';
import axios from 'axios';

const ArticlesList = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/articles'); // ton backend
        setArticles(res.data.data);
      } catch (err) {
        console.error('Erreur récupération articles :', err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  if (loading) return <p>Chargement des articles...</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {articles.map(article => (
        <div key={article._id} className="bg-white shadow rounded p-4">
          <img
            src={article.featuredImage || 'https://via.placeholder.com/400x200'}
            alt={article.title}
            className="w-full h-48 object-cover rounded mb-4"
          />
          <h2 className="text-xl font-bold">{article.title}</h2>
          <p className="text-gray-700">{article.excerpt}</p>
          <p className="text-sm text-gray-500 mt-2">Publié par {article.author}</p>
        </div>
      ))}
    </div>
  );
};

export default ArticlesList;
