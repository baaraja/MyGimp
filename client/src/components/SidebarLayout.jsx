import React, { useState, useEffect } from 'react'
import { Outlet, NavLink, Link, useLocation, useNavigate } from 'react-router-dom'
import { Modal, Form, Button, Spinner } from 'react-bootstrap'

function IconProjects(){
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="3" width="8" height="8" stroke="currentColor" strokeWidth="1.5" rx="1"/>
      <rect x="13" y="3" width="8" height="8" stroke="currentColor" strokeWidth="1.5" rx="1"/>
      <rect x="3" y="13" width="8" height="8" stroke="currentColor" strokeWidth="1.5" rx="1"/>
      <rect x="13" y="13" width="8" height="8" stroke="currentColor" strokeWidth="1.5" rx="1"/>
    </svg>
  )
}

export default function SidebarLayout(){
  const [collapsed, setCollapsed] = useState(false)
  const [username, setUsername] = useState(null)
  const [recent, setRecent] = useState([])
  const [showCreate, setShowCreate] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newDesc, setNewDesc] = useState('')
  const [creating, setCreating] = useState(false)
  const [createError, setCreateError] = useState(null)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(()=>{
    setUsername(typeof window !== 'undefined' ? localStorage.getItem('username') : null)
  }, [])

  async function loadRecent(){
    try {
      const token = localStorage.getItem('token')
      if (!token) return
      const res = await fetch('http://localhost:4000/projects', { headers: { 'authorization': 'Bearer ' + token } })
      if (!res.ok) return
      const data = await res.json()
      setRecent(Array.isArray(data) ? data.slice(0,4) : [])
    } catch (err) {
      console.debug('loadRecent failed', err)
    }
  }

  useEffect(()=>{
    loadRecent()
  }, [])

  function logout(){
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    window.location.href = '/'
  }

  const width = collapsed ? 72 : 260

  return (
    <div style={{display:'flex', height:'100vh'}}>
      <aside style={{width, transition:'width .18s ease', background: '#f7fbff', borderRight: '1px solid #e6eefc', paddingTop:8, display:'flex', flexDirection:'column'}}>
        <div style={{padding: collapsed ? 8 : 12, display:'flex', alignItems:'center', justifyContent:'space-between'}}>
          <div style={{display:'flex', alignItems:'center', flex: collapsed ? 1 : 'none', justifyContent: collapsed ? 'center' : 'flex-start'}}>
            <div style={{width:collapsed?40:36, height:collapsed?40:36, borderRadius:8, background:'#eef2ff', display:'flex', alignItems:'center', justifyContent:'center', marginRight:collapsed?0:8}} title={username || 'Guest'}>
              <strong style={{color:'#3b82f6'}}>{username ? username[0].toUpperCase() : 'U'}</strong>
            </div>
            {( !collapsed ) && (
              <div>
                <div style={{fontWeight:600}}>{username || 'Guest'}</div>
                <div style={{fontSize:12, color:'#6b7280'}}>@{username ? username.toLowerCase() : 'guest'}</div>
              </div>
            )}
          </div>
          <div>
            <button
              style={{border:'none', background:'transparent', width:32, height:32, display:'flex', alignItems:'center', justifyContent:'center'}}
              onClick={()=>setCollapsed(c=>!c)} aria-label="Toggle sidebar"
              title={collapsed ? 'Expand' : 'Collapse'}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{transform: collapsed ? 'rotate(180deg)' : 'none'}}>
                <path d="M15 18l-6-6 6-6" stroke="#374151" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
        <div style={{padding:collapsed ? '8px .5rem' : '0 .75rem', marginBottom:12}}>
          {(!collapsed) && <div style={{fontSize:12, color:'#6b7280', marginBottom:6}}>Recent</div>}
          {recent.length > 0 && (
            <ul style={{listStyle:'none', padding:0, margin:0, display:'flex', flexDirection:collapsed ? 'row' : 'column', gap:collapsed?8:0, justifyContent: collapsed ? 'center' : 'flex-start'}}>
              {recent.map(r => (
                <li key={r.id} style={{marginBottom:collapsed?0:8, display: collapsed ? 'inline-flex' : 'block'}}>
                  {collapsed ? (
                    <Link title={r.title} to={`/projects/${r.id}`} style={{display:'inline-block', width:40, height:40, borderRadius:8, background:'#fff', border:'1px solid #e6eefc', display:'flex', alignItems:'center', justifyContent:'center', textDecoration:'none', color:'#374151'}}>
                      <strong style={{fontSize:12}}>{r.title ? r.title[0].toUpperCase() : 'P'}</strong>
                    </Link>
                  ) : (
                    <Link
                      title={r.title}
                      to={`/projects/${r.id}`}
                      style={{display:'flex', justifyContent:'space-between', gap:8, color:'#374151', textDecoration:'none', fontSize:13}}
                    >
                      <span style={{overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', maxWidth:160}}>{r.title}</span>
                      <small style={{color:'#6b7280'}}>{r.createdAt ? new Date(r.createdAt).toLocaleDateString() : ''}</small>
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
        <nav style={{padding:'0 .5rem'}}>
          <ul style={{listStyle:'none', padding:0, margin:0, display:'flex', flexDirection:'column', gap:8}}>
            {!(location.pathname.startsWith('/projects') || location.pathname.startsWith('/u/')) && (
              <li>
                <NavLink to="/projects" style={({isActive})=>({display:'flex', alignItems:'center', padding:collapsed ? '.25rem' : '.45rem .75rem', borderRadius:8, color: isActive ? '#1e40af' : '#374151', background: isActive ? '#eef6ff' : 'transparent', borderLeft: isActive ? '3px solid #3b82f6' : '3px solid transparent', textDecoration:'none', justifyContent:collapsed ? 'center' : 'flex-start'})}>
                  <span style={{marginRight:collapsed?0:8, color:'#6b7280'}} title="Projects"><IconProjects/></span>
                  {(!collapsed) ? <span>Projects</span> : null}
                </NavLink>
              </li>
            )}
            <li style={{display:'flex', justifyContent: collapsed ? 'center' : 'flex-start'}}>
              <button
                style={{width:collapsed?40:'100%', height:collapsed?40:'auto', textAlign:collapsed?'center':'left', padding:collapsed?0:'.5rem .75rem', borderRadius:8, border:'1px solid #cfe0ff', background:'#fff', display:'flex', alignItems:'center', justifyContent:collapsed?'center':'flex-start', gap:8}}
                onClick={()=>{
                  setCreateError(null)
                  setNewTitle('')
                  setNewDesc('')
                  setShowCreate(true)
                }}
                title="New project"
              >
                {collapsed ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 5v14M5 12h14" stroke="#374151" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                ) : (
                  '+ New Project'
                )}
              </button>
            </li>
          </ul>
        </nav>
        <Modal show={showCreate} onHide={()=>setShowCreate(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Create new project</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={async (e)=>{e.preventDefault();
              setCreateError(null)
              if (!newTitle || newTitle.trim().length === 0) {
                setCreateError('Title is required');
                return
              }
              try {
                setCreating(true)
                const token = localStorage.getItem('token')
                const res = await fetch('http://localhost:4000/projects', {
                  method: 'POST',
                  headers: { 'content-type':'application/json', 'authorization': 'Bearer ' + token },
                  body: JSON.stringify({ title: newTitle, description: newDesc })
                })
                const data = await res.json()
                if (res.ok && data && data.id) {
                  setShowCreate(false)
                  setNewTitle('')
                  setNewDesc('')
                  await loadRecent()
                  navigate(`/projects/${data.id}`)
                } else {
                  setCreateError(data?.error || 'Failed to create project')
                }
              } catch (err) {
                console.error(err)
                setCreateError('Network error')
              } finally { setCreating(false) }
            }}>
              <Form.Group className="mb-3" controlId="projTitle">
                <Form.Label>Title</Form.Label>
                <Form.Control value={newTitle} onChange={e=>setNewTitle(e.target.value)} placeholder="Project title" />
              </Form.Group>
              <Form.Group className="mb-3" controlId="projDesc">
                <Form.Label>Description (optional)</Form.Label>
                <Form.Control as="textarea" rows={3} value={newDesc} onChange={e=>setNewDesc(e.target.value)} placeholder="Short description" />
              </Form.Group>
              {createError && <div style={{color:'var(--bs-danger)', marginBottom:8}}>{createError}</div>}
              <div style={{display:'flex', justifyContent:'flex-end', gap:8}}>
                <Button variant="secondary" onClick={()=>setShowCreate(false)} disabled={creating}>Cancel</Button>
                <Button type="submit" variant="primary" disabled={creating}>
                  {creating ? <><Spinner animation="border" size="sm" /> Creating...</> : 'Create'}
                </Button>
              </div>
            </Form>
          </Modal.Body>
        </Modal>
        <div style={{flexGrow:1}} />
      </aside>
      <main style={{flexGrow:1, padding:16}}>
        <Outlet />
      </main>
    </div>
  )
}
