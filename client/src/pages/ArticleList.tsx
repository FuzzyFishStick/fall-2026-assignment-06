
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

type Article = {
  articleId: number
  title: string
  contents: string
}

function ArticleList() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  
useEffect(() => {
  const controller = new AbortController()

  async function fetchArticles() {
    setLoading(true)
    setError('')

    try {
      const query = searchTerm.trim()

      const url = query
        ? `http://localhost:8080/articles?title_contains=${encodeURIComponent(query)}`
        : 'http://localhost:8080/articles'

      const response = await fetch(url, {
        signal: controller.signal,
      })

      if (!response.ok) {
        throw new Error('Failed to fetch articles')
      }

      const data: Article[] = await response.json()
      setArticles(data)
    } catch (error) {
      if (controller.signal.aborted) return

      setError('Unable to load articles. Please try again.')
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false)
      }
    }
  }

  const timeoutId = setTimeout(fetchArticles, 300)

  return () => {
    clearTimeout(timeoutId)
    controller.abort()
  }
}, [searchTerm])

  return (
    <section>
      <h2>All Articles</h2>
      <p>Browse articles and discover something new.</p>

<div>
  <label htmlFor="article-search">Search Articles</label>

  <input
    id="article-search"
    type="search"
    placeholder="Search by title..."
    value={searchTerm}
    onChange={(event) => setSearchTerm(event.target.value)}
  />
</div>

      <Link to="/articles/new">+ Create Article</Link>

      {loading && <p>Loading articles...</p>}

      {error && <p role="alert">{error}</p>}

      {!loading && !error && articles.length === 0 && (
        <p>No articles found.</p>
      )}

      {!loading && !error && articles.map((article) => (
        <article key={article.articleId}>
          <h3>{article.title}</h3>
          <p>
            {article.contents.length > 150
              ? `${article.contents.slice(0, 150)}...`
              : article.contents}
          </p>
          <Link to={`/articles/${article.articleId}`}>
            Read More
          </Link>
        </article>
      ))}
    </section>
  )
}

export default ArticleList