import { FC } from 'react'

interface BlackCellProps {
	cellSize: number
}
const BlackCell: FC<BlackCellProps> = ({ cellSize }) => {
	const margin = Math.max(Math.ceil(cellSize / 30), 1)
	return (
		<div
			style={{
				width: cellSize - margin * 2,
				height: cellSize - margin * 2,
				borderRadius: cellSize / 10,
				margin,
			}}
			className='shrink-0 bg-violet-100'
		/>
	)
}

export default BlackCell
