import { Invoice, ProductLine } from '../data/types'
import React, { FC, useEffect, useState } from 'react'
import { initialInvoice, initialProductLine } from '../data/initialData'

import Document from './Document'
import Download from './DownloadPDF'
import EditableCalendarInput from './EditableCalendarInput'
import EditableFileImage from './EditableFileImage'
import EditableInput from './EditableInput'
import EditableTextarea from './EditableTextarea'
import { Font } from '@react-pdf/renderer'
import Image from "next/image"
import { Image as ImagePDF } from '@react-pdf/renderer'
import LogoNRPW from "./images/NRPW_4x.png";
import NonEditableTextarea from "../components/NonEditableTextarea"
import Page from './Page'
import Text from './Text'
import View from './View'
import compose from '../styles/compose'
import format from 'date-fns/format'

Font.register({
	family: 'Nunito',
	fonts: [
		{ src: 'https://fonts.gstatic.com/s/nunito/v12/XRXV3I6Li01BKofINeaE.ttf' },
		{ src: 'https://fonts.gstatic.com/s/nunito/v12/XRXW3I6Li01BKofA6sKUYevN.ttf', fontWeight: 600 },
	],
})

interface Props {
	data?: Invoice
	pdfMode?: boolean
}

const InvoicePage: FC<Props> = ({ data, pdfMode }) => {
	const [invoice, setInvoice] = useState<Invoice>(data ? { ...data } : { ...initialInvoice })
	const [subTotal, setSubTotal] = useState<number>()
	const [saleTax, setSaleTax] = useState<number>()

	const dateFormat = 'MMM dd, yyyy'
	const invoiceDate = invoice.invoiceDate !== '' ? new Date(invoice.invoiceDate) : new Date()
	const invoiceDueDate =
		invoice.invoiceDueDate !== ''
			? new Date(invoice.invoiceDueDate)
			: new Date(invoiceDate.valueOf())

	if (invoice.invoiceDueDate === '') {
		invoiceDueDate.setDate(invoiceDueDate.getDate() + 30)
	}

	const handleChange = (name: keyof Invoice, value: string | number) => {
		if (name !== 'productLines') {
			const newInvoice = { ...invoice }
			if (typeof window !== 'undefined') {
				localStorage.setItem(name, value as string);
			} else {
				console.log('You are on the server')
				// 👉️ can't use localStorage
			}
			if (name === 'logoWidth' && typeof value === 'number') {
				newInvoice[name] = value
			} else if (name !== 'logoWidth' && typeof value === 'string') {
				newInvoice[name] = value
			}

			setInvoice(newInvoice)
		}
	}

	const handleProductLineChange = (index: number, name: keyof ProductLine, value: string) => {
		const productLines = invoice.productLines.map((productLine: any, i: number) => {
			if (i === index) {
				const newProductLine = { ...productLine }

				if (name === 'description') {
					newProductLine[name] = value
				} else {
					if (
						value[value.length - 1] === '.' ||
						(value[value.length - 1] === '0' && value.includes('.'))
					) {
						newProductLine[name] = value
					} else {
						const n = parseFloat(value)

						newProductLine[name] = (n ? n : 0).toString()
					}
				}

				return newProductLine
			}

			return { ...productLine }
		})

		setInvoice({ ...invoice, productLines })
	}

	const handleRemove = (i: number) => {
		const productLines = invoice.productLines.filter((productLine: any, index: number) => index !== i)

		setInvoice({ ...invoice, productLines })
	}

	const handleAdd = () => {
		const productLines = [...invoice.productLines, { ...initialProductLine }]

		setInvoice({ ...invoice, productLines })
	}

	const calculateAmount = (quantity: string, rate: string) => {
		const quantityNumber = parseFloat(quantity)
		const rateNumber = parseFloat(rate)
		const amount = quantityNumber && rateNumber ? quantityNumber * rateNumber : 0

		return amount.toFixed(2)
	}

	useEffect(() => {
		let subTotal = 0

		invoice.productLines.forEach((productLine: { quantity: string; rate: string }) => {
			const quantityNumber = parseFloat(productLine.quantity)
			const rateNumber = parseFloat(productLine.rate)
			const amount = quantityNumber && rateNumber ? quantityNumber * rateNumber : 0

			subTotal += amount
		})

		setSubTotal(subTotal)
	}, [invoice.productLines])

	useEffect(() => {
		const match = invoice.taxLabel.match(/(\d+)%/)
		const taxRate = match ? parseFloat(match[1]) : 0
		const saleTax = subTotal ? (subTotal * taxRate) / 100 : 0

		setSaleTax(saleTax)
	}, [subTotal, invoice.taxLabel])

	return (
		<Document pdfMode={pdfMode}>
			<Page className="invoice-wrapper" pdfMode={pdfMode}>
				{!pdfMode && <Download data={invoice} />}

				<View className="flex" pdfMode={pdfMode}>
					<View className="w-50 flex-col" pdfMode={pdfMode}>
						{!pdfMode ?			
						<Image
							className="logo"
							alt="Your Logo"
							src="/images/NRPW_4x.png"
							width={invoice.logoWidth}
							height={77}
						/> :
						<ImagePDF
							style={{ ...compose(`image`), maxWidth: invoice.logoWidth }}
							src="/images/NRPW_4x.png"
						/>}
						<NonEditableTextarea
							className="fs-20 bold m-0"
							value="Northern Rivers Property Works"
							pdfMode={pdfMode}
						/>
						<NonEditableTextarea
							className="m-0"
							value="B. Day, S. Grant"
							pdfMode={pdfMode}
						/>
						<NonEditableTextarea
							className="m-0"
							value="Murwillumbah"
							pdfMode={pdfMode}
						/>
						<NonEditableTextarea
							className="m-0"
							value="2484"
							pdfMode={pdfMode}
						/>
					</View>
					<View className="w-50" pdfMode={pdfMode}>
						<EditableInput
							className="fs-45 right bold"
							placeholder="Invoice"
							value={invoice.title}
							onChange={(value: string | number) => handleChange('title', value)}
							pdfMode={pdfMode}
						/>
					</View>
				</View>

				<View className="flex mt-40" pdfMode={pdfMode}>
					<View className="w-55" pdfMode={pdfMode}>
						<NonEditableTextarea
							className="bold dark mb-5"
							value={invoice.billTo}
							pdfMode={pdfMode}
						/>
						<EditableInput
							placeholder="Your Client's Name"
							value={invoice.clientName}
							onChange={(value: string | number) => handleChange('clientName', value)}
							pdfMode={pdfMode}
						/>
						<EditableInput
							placeholder="Client's Address"
							value={invoice.clientAddress}
							onChange={(value: string | number) => handleChange('clientAddress', value)}
							pdfMode={pdfMode}
						/>
						<EditableInput
							placeholder="City, State Zip"
							value={invoice.clientAddress2}
							onChange={(value: string | number) => handleChange('clientAddress2', value)}
							pdfMode={pdfMode}
						/>
					</View>
					<View className="w-45" pdfMode={pdfMode}>
						<View className="flex mb-5 flex-vert-center" pdfMode={pdfMode}>
							<View className="w-40" pdfMode={pdfMode}>
								<NonEditableTextarea
									className="bold"
									value={invoice.invoiceTitleLabel}
									pdfMode={pdfMode}
								/>
							</View>
							<View className="w-60" pdfMode={pdfMode}>
								<EditableInput
									placeholder="INV-12"
									value={invoice.invoiceTitle}
									onChange={(value: string | number) => handleChange('invoiceTitle', value)}
									pdfMode={pdfMode}
								/>
							</View>
						</View>
						<View className="flex mb-5 flex-vert-center" pdfMode={pdfMode}>
							<View className="w-40" pdfMode={pdfMode}>
								<NonEditableTextarea
									className="bold"
									value={invoice.invoiceDateLabel}
									pdfMode={pdfMode}
								/>
							</View>
							<View className="w-60" pdfMode={pdfMode}>
								<EditableCalendarInput
									value={format(invoiceDate, dateFormat)}
									selected={invoiceDate}
									onChange={(date: any) =>
										handleChange(
											'invoiceDate',
											date && !Array.isArray(date) ? format(date, dateFormat) : ''
										)
									}
									pdfMode={pdfMode}
								/>
							</View>
						</View>
						<View className="flex mb-5 flex-vert-center" pdfMode={pdfMode}>
							<View className="w-40" pdfMode={pdfMode}>
								<NonEditableTextarea
									className="bold"
									value={invoice.invoiceDueDateLabel}
									pdfMode={pdfMode}
								/>
							</View>
							<View className="w-60" pdfMode={pdfMode}>
								<EditableCalendarInput
									value={format(invoiceDueDate, dateFormat)}
									selected={invoiceDueDate}
									onChange={(date: any) =>
										handleChange(
											'invoiceDueDate',
											date && !Array.isArray(date) ? format(date, dateFormat) : ''
										)
									}
									pdfMode={pdfMode}
								/>
							</View>
						</View>
					</View>
				</View>

				<View className="mt-30 bg-dark flex" pdfMode={pdfMode}>
					<View className="w-48 p-4-8" pdfMode={pdfMode}>
						<NonEditableTextarea
							className="white bold"
							value={invoice.productLineDescription}
							pdfMode={pdfMode}
						/>
					</View>
					<View className="w-17 p-4-8" pdfMode={pdfMode}>
						<NonEditableTextarea
							className="white bold right"
							value={invoice.productLineQuantity}
							pdfMode={pdfMode}
						/>
					</View>
					<View className="w-17 p-4-8" pdfMode={pdfMode}>
						<NonEditableTextarea
							className="white bold right"
							value={invoice.productLineQuantityRate}
							pdfMode={pdfMode}
						/>
					</View>
					<View className="w-18 p-4-8" pdfMode={pdfMode}>
						<NonEditableTextarea
							className="white bold right"
							value={invoice.productLineQuantityAmount}
							pdfMode={pdfMode}
						/>
					</View>
				</View>

				{invoice.productLines.map((productLine: { description: string; quantity: string; rate: string }, i: number) => {
					return pdfMode && productLine.description === '' ? (
						<Text key={i}></Text>
					) : (
						<View key={i} className="row flex" pdfMode={pdfMode}>
							<View className="w-48 p-4-8 pb-10" pdfMode={pdfMode}>
								<EditableTextarea
									className="dark"
									rows={2}
									placeholder="Enter item name/description"
									value={productLine.description}
									onChange={(value: string) => handleProductLineChange(i, 'description', value)}
									pdfMode={pdfMode}
								/>
							</View>
							<View className="w-17 p-4-8 pb-10" pdfMode={pdfMode}>
								<EditableInput
									className="dark right"
									value={productLine.quantity}
									onChange={(value: string) => handleProductLineChange(i, 'quantity', value)}
									pdfMode={pdfMode}
								/>
							</View>
							<View className="w-17 p-4-8 pb-10" pdfMode={pdfMode}>
								<EditableInput
									className="dark right"
									value={productLine.rate}
									onChange={(value: string) => handleProductLineChange(i, 'rate', value)}
									pdfMode={pdfMode}
								/>
							</View>
							<View className="w-18 p-4-8 pb-10" pdfMode={pdfMode}>
								<Text className="dark right" pdfMode={pdfMode}>
									{calculateAmount(productLine.quantity, productLine.rate)}
								</Text>
							</View>
							{!pdfMode && (
								<button
									className="link row__remove"
									aria-label="Remove Row"
									title="Remove Row"
									onClick={() => handleRemove(i)}
								>
									<span className="icon icon-remove bg-red"></span>
								</button>
							)}
						</View>
					)
				})}

				<View className="flex" pdfMode={pdfMode}>
					<View className="w-50 mt-10" pdfMode={pdfMode}>
						{!pdfMode && (
							<button className="link" onClick={handleAdd}>
								<span className="icon icon-add bg-green mr-10"></span>
								Add Line Item
							</button>
						)}
					</View>
					<View className="w-50 mt-20" pdfMode={pdfMode}>
						<View className="flex" pdfMode={pdfMode}>
							<View className="w-50 p-5" pdfMode={pdfMode}>
								<EditableInput
									value={invoice.subTotalLabel}
									onChange={(value: string | number) => handleChange('subTotalLabel', value)}
									pdfMode={pdfMode}
								/>
							</View>
							<View className="w-50 p-5" pdfMode={pdfMode}>
								<Text className="right bold dark" pdfMode={pdfMode}>
									{subTotal?.toFixed(2)}
								</Text>
							</View>
						</View>
						<View className="flex" pdfMode={pdfMode}>
							<View className="w-50 p-5" pdfMode={pdfMode}>
								<EditableInput
									value={invoice.taxLabel}
									onChange={(value: string | number) => handleChange('taxLabel', value)}
									pdfMode={pdfMode}
								/>
							</View>
							<View className="w-50 p-5" pdfMode={pdfMode}>
								<Text className="right bold dark" pdfMode={pdfMode}>
									{saleTax?.toFixed(2)}
								</Text>
							</View>
						</View>
						
						<View className="flex-centered bg-gray p-5 subtotalArea" pdfMode={pdfMode}>
							<View className="w-50 p-5" pdfMode={pdfMode}>
								<NonEditableTextarea
									className="bold"
									value={invoice.totalLabel}
									pdfMode={pdfMode}
								/>
							</View>
							<View className="w-50 flex" pdfMode={pdfMode}>
								<NonEditableTextarea
									className="dark bold right ml-30"
									value={invoice.currency}
									pdfMode={pdfMode}
								/>
								<Text className="right bold dark w-auto" pdfMode={pdfMode}>
									{(typeof subTotal !== 'undefined' && typeof saleTax !== 'undefined'
										? subTotal + saleTax
										: 0
									).toFixed(2)}
								</Text>
							</View>
						</View>
						
					</View>
				</View>

				<View className="mt-20" pdfMode={pdfMode}>
					<EditableInput
						className="bold w-100"
						value={invoice.notesLabel}
						onChange={(value: string | number) => handleChange('notesLabel', value)}
						pdfMode={pdfMode}
					/>
					<EditableTextarea
						className="w-100"
						rows={2}
						value={invoice.notes}
						onChange={(value: string | number) => handleChange('notes', value)}
						pdfMode={pdfMode}
					/>
				</View>
				<View className="mt-20" pdfMode={pdfMode}>
					<EditableInput
						className="bold w-100"
						value={invoice.termLabel}
						onChange={(value: string | number) => handleChange('termLabel', value)}
						pdfMode={pdfMode}
					/>
					<EditableTextarea
						className="w-100"
						rows={2}
						value={invoice.term}
						onChange={(value: string | number) => handleChange('term', value)}
						pdfMode={pdfMode}
					/>
				</View>
			</Page>
		</Document>
	)
}

export default InvoicePage
