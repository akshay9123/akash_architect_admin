import React, { act, useEffect, useState } from 'react'

const ProjectTypes = () => {
  const [activeCategory, setActiveCategory] = useState('')
  const [projects, setProjects] = useState([])

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

        if (activeCategory === 'Architecture') {
          const response = await fetch(`${API_BASE_URL}api/v1/admin/projectdetails`, {
            method: 'GET',
            credentials: 'include',
          })
          const data = await response.json()

          if (Array.isArray(data)) {
            setProjects(data)
          } else {
            toast.error('Invalid project data received')
          }
        }

        if (activeCategory === 'Interior') {
          const response = await fetch(`${API_BASE_URL}api/v1/admin/projectinterior`, {
            method: 'GET',
            credentials: 'include',
          })
          const data = await response.json()

          if (Array.isArray(data)) {
            setProjects(data)
          } else {
            toast.error('Invalid project data received')
          }
        }
      } catch (error) {}
    }

    if (activeCategory) {
      fetchProject()
    }
  }, [activeCategory])

  const buttonStyle = (category) => ({
    padding: '10px 20px',
    border: '2px solid',
    borderColor: activeCategory === category ? '#0d6efd' : '#ccc',
    backgroundColor: activeCategory === category ? '#0d6efd' : '#fff',
    color: activeCategory === category ? '#fff' : '#333',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    animation: activeCategory === category ? 'glow 1s ease-in-out infinite alternate' : 'none',
    boxShadow: activeCategory === category ? '0 0 10px rgba(13, 110, 253, 0.5)' : 'none',
  })

  return (
    <>
      {/* Inline CSS keyframes */}
      <style>{`
        @keyframes glow {
          from {
            box-shadow: 0 0 5px rgba(13, 110, 253, 0.4);
          }
          to {
            box-shadow: 0 0 15px rgba(13, 110, 253, 0.8);
          }
        }
      `}</style>

      <div style={{ display: 'flex', gap: '10px', margin: '20px 0' }}>
        <button
          style={buttonStyle('Architecture')}
          onClick={() => setActiveCategory('Architecture')}
        >
          Architecture
        </button>
        <button style={buttonStyle('Interior')} onClick={() => setActiveCategory('Interior')}>
          Interior
        </button>
      </div>

      {/* Render fetched data */}
      <div
        style={{
          padding: '20px',
          marginTop: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        {projects.length > 0 ? (
          projects.map((project) => (
            <div
              key={project._id}
              style={{
                background: 'linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)',
                padding: '18px 22px',
                borderRadius: '12px',
                boxShadow: '0 8px 20px rgba(0, 0, 0, 0.08)',
                transition: 'all 0.3s ease',
                transform: 'translateY(0)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)'
                e.currentTarget.style.boxShadow = '0 12px 25px rgba(0, 0, 0, 0.12)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.08)'
              }}
            >
              <h5
                style={{
                  margin: 0,
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#1e2a38',
                  textShadow: '0 1px 1px rgba(255, 255, 255, 0.6)',
                  letterSpacing: '0.5px',
                }}
              >
                {project.projectName}
              </h5>
            </div>
          ))
        ) : (
          <p
            style={{
              color: '#999',
              fontStyle: 'italic',
              fontSize: '16px',
              textAlign: 'center',
            }}
          >
            No projects to show.
          </p>
        )}
      </div>
    </>
  )
}

export default ProjectTypes
