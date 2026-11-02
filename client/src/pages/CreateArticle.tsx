
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function CreateArticle() {
  const navigate = useNavigate()

  const [title, setTitle] = useState('')
  const [contents, setContents] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!title.trim() || !contents.trim()) {
      setError('Please enter both a title and article contents.')
      return
    }

    setError('')
    setSubmitting(true)

    try {
      const response = await fetch('http://localhost:8080/articles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title.trim(),
          contents: contents.trim(),
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create article')
      }

      const article = await response.json()
      navigate(`/articles/${article.articleId}`)
    } catch {
      setError('Unable to create article. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section>
      <h2>Create Article</h2>
      <p>Share something new with your readers.</p>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="article-title">Title</label>
          <input
            id="article-title"
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
        </div>

        <div>
          <label htmlFor="article-contents">Contents</label>
          <textarea
            id="article-contents"
            value={contents}
            onChange={(event) => setContents(event.target.value)}
            rows={8}
          />
        </div>

        {error && <p role="alert">{error}</p>}

        <button type="submit" disabled={submitting}>
          {submitting ? 'Creating...' : 'Create Article'}
        </button>
      </form>
    </section>
  )
}

export default CreateArticle