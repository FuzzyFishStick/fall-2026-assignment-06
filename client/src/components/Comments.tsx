import { useEffect, useState } from 'react'

type Comment = {
  commentId: number
  body: string
}

type CommentsProps = {
  articleId: string
}

function Comments({ articleId }: CommentsProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [newComment, setNewComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null)
  const [editedBody, setEditedBody] = useState('')
  const [savingEdit, setSavingEdit] = useState(false)
  const [editError, setEditError] = useState('')
  const [deletingCommentId, setDeletingCommentId] = useState<number | null>(null)
  const [deleteError, setDeleteError] = useState('')

  useEffect(() => {
    async function fetchComments() {
      setLoading(true)
      setError('')

      try {
        const response = await fetch(
          `http://localhost:8080/articles/${articleId}/comments`
        )

        if (!response.ok) {
          throw new Error('Failed to fetch comments')
        }

        const data: Comment[] = await response.json()
        setComments(data)
      } catch {
        setError('Unable to load comments.')
      } finally {
        setLoading(false)
      }
    }

    fetchComments()
  }, [articleId])

async function handleAddComment(event: React.SubmitEvent<HTMLFormElement>) {
  event.preventDefault()

  if (!newComment.trim()) {
    setSubmitError('Please enter a comment.')
    return
  }

  setSubmitting(true)
  setSubmitError('')

  try {
    const response = await fetch(
      `http://localhost:8080/articles/${articleId}/comments`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          body: newComment.trim(),
        }),
      }
    )

    if (!response.ok) {
      throw new Error('Failed to add comment')
    }

    const createdComment: Comment = await response.json()

    setComments((previousComments) => [
      ...previousComments,
      createdComment,
    ])

    setNewComment('')
  } catch {
    setSubmitError('Unable to add comment. Please try again.')
  } finally {
    setSubmitting(false)
  }
}

function startEditing(comment: Comment) {
  setEditingCommentId(comment.commentId)
  setEditedBody(comment.body)
  setEditError('')
}

function cancelEditing() {
  setEditingCommentId(null)
  setEditedBody('')
  setEditError('')
}

async function handleSaveEdit(commentId: number) {
  if (!editedBody.trim()) {
    setEditError('Comment cannot be empty.')
    return
  }

  setSavingEdit(true)
  setEditError('')

  try {
    const response = await fetch(
      `http://localhost:8080/articles/${articleId}/comments/${commentId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          body: editedBody.trim(),
        }),
      }
    )

    if (!response.ok) {
      throw new Error('Failed to update comment')
    }

    setComments((previousComments) =>
      previousComments.map((comment) =>
        comment.commentId === commentId
          ? { ...comment, body: editedBody.trim() }
          : comment
      )
    )

    cancelEditing()
  } catch {
    setEditError('Unable to save comment changes.')
  } finally {
    setSavingEdit(false)
  }
}

async function handleDeleteComment(commentId: number) {
  const confirmed = window.confirm(
    'Are you sure you want to delete this comment?'
  )

  if (!confirmed) {
    return
  }

  setDeletingCommentId(commentId)
  setDeleteError('')

  try {
    const response = await fetch(
      `http://localhost:8080/articles/${articleId}/comments/${commentId}`,
      {
        method: 'DELETE',
      }
    )

    if (!response.ok) {
      throw new Error('Failed to delete comment')
    }

    setComments((previousComments) =>
      previousComments.filter(
        (comment) => comment.commentId !== commentId
      )
    )
  } catch {
    setDeleteError('Unable to delete comment. Please try again.')
  } finally {
    setDeletingCommentId(null)
  }
}

  return (
    <section>
      <h3>Comments</h3>
      
      {deleteError && <p role="alert">{deleteError}</p>}
<form onSubmit={handleAddComment}>
  <div>
    <label htmlFor="new-comment">Add a Comment</label>
    <textarea
      id="new-comment"
      value={newComment}
      onChange={(event) => setNewComment(event.target.value)}
      placeholder="Write your comment here..."
      rows={4}
    />
  </div>

  {submitError && <p role="alert">{submitError}</p>}

  <button type="submit" disabled={submitting}>
    {submitting ? 'Posting...' : 'Post Comment'}
  </button>
</form>

      {loading && <p>Loading comments...</p>}

      {error && <p role="alert">{error}</p>}

      {!loading && !error && comments.length === 0 && (
        <p>No comments yet.</p>
      )}

      
{!loading && !error && comments.map((comment) => (
  <article key={comment.commentId}>
    {editingCommentId === comment.commentId ? (
      <div>
        <textarea
          value={editedBody}
          onChange={(event) => setEditedBody(event.target.value)}
          rows={3}
          aria-label="Edit comment"
        />

        {editError && <p role="alert">{editError}</p>}

        <button
          type="button"
          onClick={() => handleSaveEdit(comment.commentId)}
          disabled={savingEdit}
        >
          {savingEdit ? 'Saving...' : 'Save'}
        </button>

        <button
          type="button"
          onClick={cancelEditing}
          disabled={savingEdit}
        >
          Cancel
        </button>
      </div>
    ) : (
      
<div>
  <p>{comment.body}</p>

  <button
    type="button"
    onClick={() => startEditing(comment)}
    disabled={deletingCommentId === comment.commentId}
  >
    Edit
  </button>

  <button
    type="button"
    onClick={() => handleDeleteComment(comment.commentId)}
    disabled={deletingCommentId === comment.commentId}
  >
    {deletingCommentId === comment.commentId
      ? 'Deleting...'
      : 'Delete'}
  </button>
</div>
    )}
  </article>
))}
    </section>
  )
}

export default Comments