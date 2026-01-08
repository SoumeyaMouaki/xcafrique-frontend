import { useEffect, useState } from 'react';
import API from '../api';
import { extractApiData } from '../utils/apiHelpers';

const ArticlesList = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await API.get('/articles');
        const articlesData = extractApiData(res);
        setArticles(articlesData);
      } catch (err) {
        setArticles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  if (loading) return <p>Chargement des articles...</p>;

  if (articles.length === 0) {
    return <p className="text-gray-500">Aucun article disponible.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {articles.map(article => (
        <div key={article._id || article.id} className="bg-white shadow rounded p-4">
          <img
            src={article.featuredImage || article.image || ''}
            alt={article.title || 'Article'}
            className="w-full h-48 object-cover rounded mb-4"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
          <h2 className="text-xl font-bold">{article.title}</h2>
          <p className="text-gray-700">{article.excerpt || article.description}</p>
          <p className="text-sm text-gray-500 mt-2">
            Publié par {article.author?.name || article.author || 'XCAfrique'}
          </p>
        </div>
      ))}
    </div>
  );
};

export default ArticlesList;
