/**
 * Simple Node script that registers two users and ensures each sees only their projects.
 * Run with: node scripts/test-auth.js
 */
const fetch = require('node-fetch')

const server = 'http://localhost:4000'

async function run(){
  // register user a
  let res = await fetch(server + '/auth/register', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ email: 'a@example.com', password: 'pass' }) })
  const a = await res.json()
  // create project as a
  await fetch(server + '/projects', { method: 'POST', headers: { 'content-type': 'application/json', 'authorization': 'Bearer ' + a.token }, body: JSON.stringify({ title: 'A project' }) })

  // register user b
  res = await fetch(server + '/auth/register', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ email: 'b@example.com', password: 'pass' }) })
  const b = await res.json()
  // create project as b
  await fetch(server + '/projects', { method: 'POST', headers: { 'content-type': 'application/json', 'authorization': 'Bearer ' + b.token }, body: JSON.stringify({ title: 'B project' }) })

  // list projects for a
  res = await fetch(server + '/projects', { headers: { 'authorization': 'Bearer ' + a.token } })
  const projectsA = await res.json()
  console.log('A projects:', projectsA.map(p => p.title))

  // list projects for b
  res = await fetch(server + '/projects', { headers: { 'authorization': 'Bearer ' + b.token } })
  const projectsB = await res.json()
  console.log('B projects:', projectsB.map(p => p.title))

}

run().catch(e => { console.error(e); process.exit(1) })
