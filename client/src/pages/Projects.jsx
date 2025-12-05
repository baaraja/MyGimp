import React, { useEffect, useState } from 'react'
import { Container, Row, Col, Card, Button, Spinner, Alert } from 'react-bootstrap'

export default function Projects(){
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [deletingId, setDeletingId] = useState(null)

  async function load(){
    setLoading(true)
    setError('')
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('http://localhost:4000/projects', { headers: { 'authorization': 'Bearer ' + token } })
      if (!res.ok) {
        const err = await res.text()
        throw new Error(err || 'Failed to load')
      }
      const data = await res.json()
      setProjects(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error(err)
      setError(err.message || 'Error loading projects')
    } finally {
      setLoading(false)
    }
  }

  useEffect(()=>{ load() }, [])

  async function deleteProject(id){
    if (!window.confirm('Delete this project? This cannot be undone.')) return
    setError('')
    setDeletingId(id)
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`http://localhost:4000/projects/${id}`, { method: 'DELETE', headers: { 'authorization': 'Bearer ' + token } })
      if (!res.ok) {
        const txt = await res.text()
        throw new Error(txt || 'Failed to delete')
      }
      await load()
    } catch (err) {
      console.error(err)
      setError(err.message || 'Error deleting project')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-0">Projects</h2>
          <div className="text-muted">Your saved files below</div>
        </div>
      </div>
      {error ? <Alert variant="danger">{error}</Alert> : null}
      {loading ? (
        <div className="d-flex justify-content-center py-5"><Spinner animation="border" /></div>
      ) : (
        <Row xs={1} sm={2} md={3} lg={4} className="g-3">
          {projects.map(p => (
            <Col key={p.id}>
              <Card className="h-100 shadow-sm">
                <div style={{height: 140, background: '#f5f5f7'}} className="d-flex align-items-center justify-content-center">
                  <div className="text-muted">Thumbnail</div>
                </div>
                <Card.Body className="d-flex flex-column">
                  <Card.Title style={{fontSize: '1.05rem', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', display:'block'}} title={p.title}>{p.title}</Card.Title>
                  {p.description ? <Card.Text className="text-muted small">{p.description}</Card.Text> : null}
                  <div className="mt-auto d-flex justify-content-between align-items-center">
                    <div style={{display:'flex', gap:8}}>
                      <Button size="sm" variant="primary" onClick={()=> window.location.href = `/editor`}>
                        Open
                      </Button>
                      <Button size="sm" variant="outline-danger" onClick={()=>deleteProject(p.id)} disabled={deletingId === p.id} title="Delete project" aria-label="Delete project">
                        {deletingId === p.id ? (
                          'Deleting...'
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6m5 0V4a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v2"/></svg>
                        )}
                      </Button>
                    </div>
                    <small className="text-muted">{p.createdAt ? new Date(p.createdAt).toLocaleDateString() : ''}</small>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  )
}
