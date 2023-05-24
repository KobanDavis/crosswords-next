import { BlackCell, Cell } from 'components'
import { FC } from 'react'

interface CellRowProps {
	letters: string[]
	y: number
	cellSize: number
}

const CellRow: FC<CellRowProps> = ({ letters, y, cellSize }) => {
	return (
		<div className='flex shrink-0'>
			{letters.map((letter, x) =>
				letter !== null ? <Cell cellSize={cellSize} key={x} coords={{ x, y }} letter={letter} /> : <BlackCell cellSize={cellSize} key={x} />
			)}
		</div>
	)
}

export default CellRow
