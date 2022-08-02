import React, { FC } from 'react'

import { Text } from '@react-pdf/renderer'
import compose from '../styles/compose'

interface Props {
  className?: string
  value?: string
  pdfMode?: boolean
}

const NonEditableTextarea: FC<Props> = ({
  className,
  value,
  pdfMode,
}) => {
  return (
    <>
      {pdfMode ? (
        <Text style={compose('span ' + (className ? className : ''))}>{value}</Text>
      ) : (
		<p style={compose('ourDetails ' + (className ? className : ''))}>{value}</p>
      )}
    </>
  )
}

export default NonEditableTextarea
