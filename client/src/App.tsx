
import { Link, Route, Routes } from 'react-router-dom'
import './App.css'
import ArticleList from './pages/ArticleList'
import CreateArticle from './pages/CreateArticle'
import ArticleDetail from './pages/ArticleDetail'
import EditArticle from './pages/EditArticle'

function App() {
  return (
    <div className="app">
      <header>
        <h1>Articles & Comments</h1>

        <nav>
          <Link to="/">All Articles</Link>
          {' | '}
          <Link to="/articles/new">Create Article</Link>
        </nav>
      </header>

      <main>
        <Routes>
          <Route
          path="/"
          element={<ArticleList />}
          />

          <Route
          path="/articles/new"
          element={<CreateArticle />}
          />

          <Route
          path="/articles/:articleId"
          element={<ArticleDetail />}
          />

          <Route
          path="/articles/:articleId/edit"
          element={<EditArticle />}
          />
        </Routes>
      </main>
    </div>
  )
}

export default App