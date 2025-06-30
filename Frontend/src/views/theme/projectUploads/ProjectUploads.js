import React, { useRef, useState } from 'react'
import {
  CCard,
  CCardBody,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CButton,
  CImage,
  CRow,
  CCol,
} from '@coreui/react'
import { toast } from 'react-toastify'
import imageAdd from '../../../assets/images/project-uploads.png'

const ProjectDetails = () => {
  const [service, setService] = useState('')
  const [projectName, setProjectName] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const fileInputRef = useRef(null)
  const [status, setStatus] = useState('')
  const handleServiceChange = (e) => setService(e.target.value)
  const handleProjectNameChange = (e) => setProjectName(e.target.value.toUpperCase())
  const handleImageChange = (e) => setImageFile(e.target.files[0])

  const handleSubmit = async (e) => {
    e.preventDefault()

    const formData = new FormData()

    formData.append('types', service)
    formData.append('projectName', projectName) // assuming it's project _id or name
    formData.append('mainImage', imageFile)
    formData.append('projectStatus', status);
    console.log('Service:', service)
    console.log('Project Name:', projectName)
    console.log('Image File:', imageFile)

    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
      const response = await fetch(`${API_BASE_URL}api/v1/admin/create`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
      })

      if (response.ok) {
        toast.success('Saved Successfully')
        setProjectName('')
        setImageFile(null)
        setService('')
        if (fileInputRef.current) fileInputRef.current.value = ''
        // if (galleryImagesRef.current) galleryImagesRef.current.value = "";
      } else {
        toast.error('Upload failed')
      }
    } catch (err) {
      console.error('Error uploading project:', err)
      toast.error('Something went wrong')
    }
  }

  return (
    <CRow className="justify-content-center">
      <CCol md={8} lg={6}>
        <CCard className="shadow-sm">
          <CCardBody>
            <h4 className="mb-4 text-center">Add New Project </h4>

            <CForm onSubmit={handleSubmit}>
              {/* Upload Image */}
              <div className="mb-4 text-center">
                <CFormLabel></CFormLabel>
                <div>
                  <CImage
                    src={imageFile ? URL.createObjectURL(imageFile) : imageAdd}
                    alt="Preview"
                    style={{
                      width: '120px',
                      height: '120px',
                      objectFit: 'cover',
                      borderRadius: '8px',
                      marginBottom: '10px',
                    }}
                  />
                </div>
                <CFormInput
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  ref={fileInputRef}
                />
              </div>

              {/* Select Service */}
              <div className="mb-4">
                <CFormLabel htmlFor="service-type">Select Service</CFormLabel>
                <CFormSelect id="service-type" value={service} onChange={handleServiceChange}>
                  <option value="">-- Select the service --</option>
                  <option value="Architecture">Architecture</option>
                  <option value="Interior">Interior</option>
                </CFormSelect>
              </div>

              {/* Project Name */}
              <div className="mb-4">
                <CFormLabel htmlFor="project-name">Enter Project Name</CFormLabel>
                <CFormInput
                  type="text"
                  id="project-name"
                  value={projectName}
                  onChange={handleProjectNameChange}
                  placeholder="Enter your project name"
                />
              </div>

              {/* Project Status Select */}
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

              {/* Submit */}
              <div className="text-end">
                <CButton type="submit" color="primary">
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
