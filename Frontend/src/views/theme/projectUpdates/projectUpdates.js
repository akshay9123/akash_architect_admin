import React, { useEffect, useRef, useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CForm,
  CFormInput,
  CFormSelect,
  CImage,
  CRow,
  CFormLabel,
} from '@coreui/react'
import { toast } from 'react-toastify'
import imageAdd from '../../../assets/images/project-uploads.png'

const ProjectDetails = () => {


  const [projects, setProjects] = useState([])
  const [projectName, setProjectName] = useState('')
  const [mainImage, setMainImage] = useState(null)
  const [galleryImages, setGalleryImages] = useState([])
  const [id, setId] = useState('')
  const [status, setStatus] = useState('')
  const mainImageRef = useRef(null)
  const galleryImagesRef = useRef(null)


  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
        const response = await fetch(`${API_BASE_URL}api/v1/admin/project/name`, {
          method: 'GET',
          credentials: 'include',
        })
        const data = await response.json()

        if (Array.isArray(data)) {
          setProjects(data)
        } else {
          toast.error('Invalid project data received')
        }
      } catch (error) {
        console.error('Error fetching project names:', error)
        toast.error('Failed to load project names')
      }
    }
    fetchProjects()
  }, [])


  const handleProjectSelect = (e) => {
    const selectedId = e.target.value
    setProjectName(selectedId)
    setId(selectedId)
  }


  const handleMainImageChange = (e) => setMainImage(e.target.files[0])


  const handleGalleryImagesChange = (e) => {
    const files = Array.from(e.target.files)
    setGalleryImages(files)
  }


  const handleRemoveGalleryImage = (indexToRemove) => {
    const updatedImages = galleryImages.filter((_, index) => index !== indexToRemove)
    setGalleryImages(updatedImages)
    

    // Reset the input field to refresh native file input UI
    if (galleryImagesRef.current) {
      galleryImagesRef.current.value = ''
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!id) {
      toast.error('Select the Project')
      return
    }

    const formData = new FormData()
    formData.append('projectName', projectName)
    formData.append('mainImage', mainImage)
    formData.append('projectStatus', status)
    galleryImages.forEach((img) => formData.append('galleryImages', img))

    try {
      const API_BASE_UR = import.meta.env.VITE_API_BASE_URL
      const response = await fetch(`${API_BASE_UR}api/v1/admin/update/images/${id}`, {
        method: 'PUT',
        body: formData,
        credentials: 'include',
      })

      if (response.ok) {
        toast.success('Project updated successfully')
        setProjectName('')
        setId('')
        setMainImage(null)
        setGalleryImages([])
        setStatus('')
        if (mainImageRef.current) mainImageRef.current.value = ''
        if (galleryImagesRef.current) galleryImagesRef.current.value = ''
      } else {
        toast.error('Update failed')
      }
    } catch (err) {
      console.error('Error updating project:', err)
      toast.error('Something went wrong')
    }
  }

  return (
    <CRow className="justify-content-center">
      <CCol xs={12} md={7} lg={5} className="mx-auto">
        <CCard className="shadow-sm">
          <CCardBody>
            <CForm onSubmit={handleSubmit}>
              <h4 className="mb-4 text-center">Update Existing Project</h4>

              {/* Project Name */}
              <div className="mb-4">
                <CFormLabel htmlFor="project-name">Project Name</CFormLabel>
                <CFormSelect id="project-name" value={projectName} onChange={handleProjectSelect}>
                  <option value="">Select the Project Name</option>
                  {projects.map((proj) => (
                    <option key={proj._id} value={proj._id}>
                      {proj.projectName}
                    </option>
                  ))}
                </CFormSelect>
              </div>

              {/* Project Status */}
              <div className="mb-4">
                <CFormLabel htmlFor="project-status">Project Status</CFormLabel>
                <CFormSelect
                  id="project-status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  disabled={!projectName}
                >
                  <option value="">Select Status</option>
                  <option value="Ongoing">Ongoing</option>
                  <option value="Completed">Completed</option>
                  <option value="Upcoming">Upcoming</option>
                </CFormSelect>
              </div>

              {/* Main Image */}
              <div className="mb-4">
                <CFormLabel>Main Image</CFormLabel>
                <div className="text-center mb-2">
                  <CImage
                    src={mainImage ? URL.createObjectURL(mainImage) : imageAdd}
                    alt="Main Preview"
                    style={{
                      width: '120px',
                      height: '120px',
                      objectFit: 'cover',
                      borderRadius: '8px',
                    }}
                  />
                </div>
                <CFormInput
                  type="file"
                  accept="image/*"
                  disabled={!projectName}
                  onChange={handleMainImageChange}
                  ref={mainImageRef}
                />
              </div>

              {/* Gallery Images */}
              <div className="mb-4">
                <CFormLabel>
                  Gallery Images {galleryImages.length > 0 && `(${galleryImages.length} selected)`}
                </CFormLabel>
                <CFormInput
                  type="file"
                  accept="image/*"
                  multiple
                  disabled={!projectName}
                  onChange={handleGalleryImagesChange}
                  ref={galleryImagesRef}
                />
                <div className="d-flex flex-wrap mt-3 gap-2">
                  {galleryImages.map((img, index) => (
                    <div
                      key={index}
                      style={{
                        position: 'relative',
                        display: 'inline-block',
                        width: '80px',
                        height: '80px',
                      }}
                    >
                      <CImage
                        src={URL.createObjectURL(img)}
                        alt={`Gallery ${index}`}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          borderRadius: '6px',
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveGalleryImage(index)}
                        style={{
                          position: 'absolute',
                          top: '-8px',
                          right: '-8px',
                          backgroundColor: '#dc3545',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '50%',
                          width: '20px',
                          height: '20px',
                          cursor: 'pointer',
                          fontSize: '12px',
                          lineHeight: '1',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <div className="text-end">
                <CButton type="submit" color="primary" disabled={!projectName}>
                  Submit
                </CButton>
              </div>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default ProjectDetails
