
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Comments from '../components/Comments'

type Article = {
  articleId: number
  title: string
  contents: string
}

function ArticleDetail() {
  const { articleId } = useParams()
  const navigate = useNavigate()
  const [deleting, setDeleting] = useState(false)
  const [article, setArticle] = useState<Article | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchArticle() {
      setLoading(true)
      setError('')

      try {
        const response = await fetch(
          `http://localhost:8080/articles/${articleId}`
        )

        if (!response.ok) {
          throw new Error('Failed to fetch article')
        }

        const data: Article = await response.json()
        setArticle(data)
      } catch {
        setError('Unable to load this article.')
      } finally {
        setLoading(false)
      }
    }

    fetchArticle()
  }, [articleId])

async function handleDelete() {
  const confirmed = window.confirm(
    'Are you sure you want to delete this article?'
  )

  if (!confirmed) {
    return
  }

  setDeleting(true)
  setError('')

  try {
    const response = await fetch(
      `http://localhost:8080/articles/${articleId}`,
      {
        method: 'DELETE',
      }
    )

    if (!response.ok) {
      throw new Error('Failed to delete article')
    }

    navigate('/')
  } catch {
    setError('Unable to delete article. Please try again.')
    setDeleting(false)
  }
}

  if (loading) {
    return <p>Loading article...</p>
  }

  if (error) {
    return <p role="alert">{error}</p>
  }

  if (!article) {
    return <p>Article not found.</p>
  }

  return (
    <section>
      <Link to="/">← Back to Articles</Link>

      <article>
        <h2>{article.title}</h2>
        <p>{article.contents}</p>
      </article>

      <Link to={`/articles/${articleId}/edit`}>
        Edit Article
      </Link>
      <button
    type="button"
    onClick={handleDelete}
    disabled={deleting}
>
  {deleting ? 'Deleting...' : 'Delete Article'}
</button>

    <Comments articleId={articleId!} />
    </section>
  )
}

export default ArticleDetail