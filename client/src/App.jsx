import React, { useState, useEffect } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Projects from './pages/Projects'
import Editor from './pages/Editor'
import SidebarLayout from './components/SidebarLayout'
import { Container, Navbar, Nav, NavDropdown } from 'react-bootstrap'

export default function App(){
  const [username, setUsername] = useState(null)
  useEffect(()=>{ setUsername(localStorage.getItem('username')) }, [])
  return (
    <div style={{fontFamily: 'Arial, sans-serif'}}>
      <Navbar bg="light" expand="lg" className="shadow-sm">
        <Container>
          <Navbar.Brand as={Link} to="/" style={{fontWeight: 700}}>MyGimp</Navbar.Brand>
          <Navbar.Toggle aria-controls="main-navbar" />
          <Navbar.Collapse id="main-navbar">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/projects">Projects</Nav.Link>
            </Nav>
            <Nav className="ms-auto align-items-center">
              {!username ? (
                <>
                  <Nav.Link as={Link} to="/login">Login</Nav.Link>
                  <Nav.Link as={Link} to="/register">Register</Nav.Link>
                </>
              ) : (
                <NavDropdown title={username} id="user-dropdown" align="end">
                  <NavDropdown.Item as={Link} to="/profile">Profile</NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={() => {
                    localStorage.removeItem('token')
                    localStorage.removeItem('username')
                    setUsername(null)
                    window.location.href = '/'
                  }}>Logout</NavDropdown.Item>
                </NavDropdown>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Container style={{padding: 24}}>
      <Routes>
        <Route path="/" element={
          <div className="d-flex flex-column justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
            <h1 style={{ fontSize: '4rem' }}>Welcome {username ? username : 'Guest'}!</h1>
            {username ? (
              <Link to={`/projects`} style={{ marginTop: '12px' }}>
                <button className="btn btn-primary" style={{ fontSize: '1.2rem' }}>Go to Dash</button>
              </Link>
            ) : (
              <p style={{ marginTop: '12px', fontSize: '1.2rem' }}>Please login or register to view your projects.</p>
            )}
            <div className="container mt-4">
              <div className="row g-3">
                <div className="col-12 col-md-4">
                  <div className="card p-3 h-100">
                    <h5>Create new project</h5>
                    <p className="text-muted">Start a new image project and open the editor.</p>
                    <div>
                      <Link to="/projects"><button className="btn btn-outline-primary">Create</button></Link>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-md-4">
                  <div className="card p-3 h-100">
                    <h5>Your projects</h5>
                    <p className="text-muted">Open your saved projects and continue editing.</p>
                    <div>
                      <Link to="/projects"><button className="btn btn-outline-primary">Open</button></Link>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-md-4">
                  <div className="card p-3 h-100">
                    <h5>Recent</h5>
                    <p className="text-muted">Quick access to recently edited projects.</p>
                    <div>
                      <Link to="/projects"><button className="btn btn-outline-primary">View</button></Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        } />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<SidebarLayout />}>
          <Route path="/u/:user/boards" element={<Projects />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:id" element={<Editor />} />
          <Route path="/editor" element={<Editor />} />
        </Route>
      </Routes>
      </Container>
    </div>
  )
}
