import React from 'react'
import { CFooter } from '@coreui/react'

const AppFooter = () => {
  return (
    <CFooter className="px-4">
      <div>
        <strong>Designed by Info Era Software Services Pvt. Ltd.</strong>
      </div>
      <div className="ms-auto">
        <span className="me-1"> Info Era Software Services Pvt. Ltd.</span>
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)
