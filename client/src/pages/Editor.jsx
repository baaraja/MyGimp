import React, { useEffect, useRef, useState } from 'react'

export default function Editor() {
  const canvasRef = useRef(null)
  const [tool, setTool] = useState('brush')
  const [color, setColor] = useState('#000000')
  const [size, setSize] = useState(12)
  const [isDrawing, setIsDrawing] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    canvas.width = Math.floor(rect.width * dpr)
    canvas.height = Math.floor(rect.height * dpr)
    const ctx = canvas.getContext('2d')
    ctx.scale(dpr, dpr)
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, rect.width, rect.height)
  }, [])

  const getCtx = () => {
    const canvas = canvasRef.current
    if (!canvas) return null
    const ctx = canvas.getContext('2d')
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.lineWidth = size
    ctx.strokeStyle = tool === 'eraser' ? '#ffffff' : color
    return ctx
  }

  const pos = (e) => {
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    return { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }

  const onDown = (e) => {
    setIsDrawing(true)
    const ctx = getCtx()
    const { x, y } = pos(e)
    ctx.beginPath()
    ctx.moveTo(x, y)
    ctx.lineTo(x, y)
    ctx.stroke()
  }

  const onMove = (e) => {
    if (!isDrawing) return
    const ctx = getCtx()
    const { x, y } = pos(e)
    ctx.lineTo(x, y)
    ctx.stroke()
  }

  const onUp = () => setIsDrawing(false)

  const exportPNG = () => {
    const canvas = canvasRef.current
    const url = canvas.toDataURL('image/png')
    const a = document.createElement('a')
    a.href = url
    a.download = 'canvas.png'
    a.click()
  }

  const saveLocal = () => {
    const canvas = canvasRef.current
    const url = canvas.toDataURL('image/png')
    localStorage.setItem('mygimp:last', url)
  }

  const loadLocal = () => {
    const url = localStorage.getItem('mygimp:last')
    if (!url) return
    const img = new Image()
    img.onload = () => {
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const rect = canvas.getBoundingClientRect()
      ctx.drawImage(img, 0, 0, rect.width, rect.height)
    }
    img.src = url
  }

  return (
    <div style={{ minHeight: '80vh', width: '100%', background:'transparent', color:'#222' }}>
      <div style={{ position:'relative', margin:'12px', display:'flex', alignItems:'center', gap:12, padding:'8px 12px', borderRadius:8, background:'#ffffff', border:'1px solid #e5e7eb' }}>
        <div style={{ display:'flex', gap:8 }}>
          <button onClick={() => { setTool('brush'); const ctx = getCtx(); ctx && ctx.beginPath() }} style={{ padding:'6px 10px', borderRadius:6, border:'1px solid #d1d5db', background: tool==='brush'?'#efefef':'#fff' }}>Brush</button>
          <button onClick={() => { setTool('eraser'); const ctx = getCtx(); ctx && ctx.beginPath() }} style={{ padding:'6px 10px', borderRadius:6, border:'1px solid #d1d5db', background: tool==='eraser'?'#efefef':'#fff' }}>Eraser</button>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <span style={{fontSize:12, color:'#6b7280'}}>Color</span>
          <input type="color" value={color} onChange={(e)=>{ setColor(e.target.value); const ctx = getCtx(); ctx && ctx.beginPath() }} style={{ width:24, height:24, border:'none', background:'transparent' }} />
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <span style={{fontSize:12, color:'#6b7280'}}>Size</span>
          <input type="range" min="1" max="64" value={size} onChange={(e)=>{ setSize(Number(e.target.value)); const ctx = getCtx(); if (ctx) { ctx.lineWidth = Number(e.target.value); ctx.beginPath() } }} />
          <span style={{fontSize:12, color:'#6b7280'}}>{size}</span>
        </div>
        <div style={{ marginLeft:'auto', display:'flex', gap:8 }}>
          <button onClick={exportPNG} style={{ padding:'6px 10px', borderRadius:6, border:'1px solid #d1d5db', background:'#fff' }}>Export PNG</button>
          <button onClick={saveLocal} style={{ padding:'6px 10px', borderRadius:6, border:'1px solid #d1d5db', background:'#fff' }}>Save</button>
          <button onClick={loadLocal} style={{ padding:'6px 10px', borderRadius:6, border:'1px solid #d1d5db', background:'#fff' }}>Load</button>
        </div>
      </div>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'center', padding:'12px' }}>
        <div style={{ width:'min(1200px, 90vw)', height:'min(720px, 70vh)', background:'transparent', border:'1px solid #e5e7eb', borderRadius:8, boxShadow:'0 8px 20px rgba(0,0,0,.08)', display:'flex', alignItems:'center', justifyContent:'center' }}>
          <canvas
            ref={canvasRef}
            style={{ width:'calc(100% - 24px)', height:'calc(100% - 24px)', margin:12, borderRadius:4, background:'#ffffff' }}
            onMouseDown={onDown}
            onMouseMove={onMove}
            onMouseUp={onUp}
            onMouseLeave={onUp}
            onTouchStart={(e)=>{ const t=e.touches[0]; onDown({ clientX:t.clientX, clientY:t.clientY }) }}
            onTouchMove={(e)=>{ const t=e.touches[0]; onMove({ clientX:t.clientX, clientY:t.clientY }) }}
            onTouchEnd={onUp}
          />
        </div>
      </div>
    </div>
  )
}
