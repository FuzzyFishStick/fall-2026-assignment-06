
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

function EditArticle() {
  const { articleId } = useParams()
  const navigate = useNavigate()

  const [title, setTitle] = useState('')
  const [contents, setContents] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadArticle() {
      try {
        const response = await fetch(
          `http://localhost:8080/articles/${articleId}`
        )

        if (!response.ok) {
          throw new Error('Unable to load article')
        }

        const article = await response.json()

        setTitle(article.title)
        setContents(article.contents)
      } catch {
        setError('Unable to load article for editing.')
      } finally {
        setLoading(false)
      }
    }

    loadArticle()
  }, [articleId])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!title.trim() || !contents.trim()) {
      setError('Please enter both a title and article contents.')
      return
    }

    setError('')
    setSubmitting(true)

    try {
      const response = await fetch(
        `http://localhost:8080/articles/${articleId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: title.trim(),
            contents: contents.trim(),
          }),
        }
      )

      if (!response.ok) {
        throw new Error('Unable to update article')
      }

      navigate(`/articles/${articleId}`)
    } catch {
      setError('Unable to save changes. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <p>Loading article...</p>
  }

  return (
    <section>
      <Link to={`/articles/${articleId}`}>← Back to Article</Link>

      <h2>Edit Article</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="edit-title">Title</label>
          <input
            id="edit-title"
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
        </div>

        <div>
          <label htmlFor="edit-contents">Contents</label>
          <textarea
            id="edit-contents"
            value={contents}
            onChange={(event) => setContents(event.target.value)}
            rows={8}
          />
        </div>

        {error && <p role="alert">{error}</p>}

        <button type="submit" disabled={submitting}>
          {submitting ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </section>
  )
}

export default EditArticle