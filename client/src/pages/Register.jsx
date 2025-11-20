import React, { useState } from 'react'

export default function Register(){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')

  async function submit(e){
    e.preventDefault()
    const res = await fetch('http://localhost:4000/auth/register', {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email, password, name })
    })
    const data = await res.json()
    if (data.success) {
      setMessage('Registered successfully — please login')
      setTimeout(()=>{ window.location.href = '/login' }, 1500)
    } else if(data.token) {
      localStorage.setItem('token', data.token)
      if (data.user && data.user.name) localStorage.setItem('username', data.user.name)
      else localStorage.setItem('username', email)
      setMessage('Registered and logged in')
      window.location.href = '/projects'
    } else {
      setMessage(data.error || 'Error')
    }
  }

  return (
    <div className="d-flex justify-content-center align-items-center" style={{height: '75vh'}}>
      <div className="card p-4" style={{width: 720}}>
        <h3 className="mb-3">Register</h3>
        <form onSubmit={submit}>
          <div className="mb-3">
            <label className="form-label">Name</label>
            <input className="form-control form-control-lg" value={name} onChange={e=>setName(e.target.value)} />
          </div>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input className="form-control form-control-lg" value={email} onChange={e=>setEmail(e.target.value)} />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input className="form-control form-control-lg" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
          </div>
          <div className="d-flex justify-content-center">
            <button className="btn btn-primary btn-lg">Register</button>
          </div>
        </form>
        <div className="mt-3 text-center text-danger">{message}</div>
      </div>
    </div>
  )
}
