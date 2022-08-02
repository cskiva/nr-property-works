import React, { FC, useEffect, useState } from 'react'

import { Invoice } from '../data/types'
import InvoicePage from './InvoicePage'
import { PDFDownloadLink } from '@react-pdf/renderer'

interface Props {
	data: Invoice
}

const Download: FC<Props> = ({ data }) => {

	const [show, setShow] = useState<boolean>(false)
	const [isClient, setIsClient] = useState(false)

	useEffect(() => {
		setShow(false)

		const timeout = setTimeout(() => {
			setShow(true)
		}, 500)

		return () => clearTimeout(timeout)
	}, [data])


	useEffect(() => {
		setIsClient(true)
	}, [])

	return (
		<>
			{isClient && (
				<div className={'download-pdf ' + (!show ? 'loading' : '')} title="Save PDF">
					{show && (
						<PDFDownloadLink
							document={<InvoicePage pdfMode={true} data={data} />}
							fileName={`${data.invoiceTitle ? data.invoiceTitle.toLowerCase() : 'invoice'}.pdf`}
							aria-label="Save PDF"
						></PDFDownloadLink>
					)}
				</div>
			)}
		</>
	)
}

export default Download
