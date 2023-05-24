import clsx from 'clsx'
import { Crossword } from 'lib'
import { useCrossword } from 'providers/Crossword'
import React, { FC } from 'react'

interface CellProps {
	letter: string
	coords: Crossword.Position
	cellSize: number
}

const Cell: FC<CellProps> = ({ letter, coords, cellSize }) => {
	const { crossword, numberPositionMap, solvedPositions } = useCrossword()
	const position = Crossword.toId(coords.x, coords.y)
	const number = numberPositionMap[position]

	const handleOnKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		const value = e.key.toUpperCase()
		const keyIsLetter = value.match(/^[A-Z]{1}$/)
		let nextCellCoords: Crossword.Position
		if (keyIsLetter) {
			crossword.updateCell(coords, value)
			nextCellCoords = crossword.getNextCell(coords)
		} else if (e.key === 'Backspace') {
			crossword.updateCell(coords, '')
			nextCellCoords = crossword.getPrevCell(coords)
		}

		if (nextCellCoords) {
			const { x, y } = nextCellCoords
			document.getElementById(Crossword.toId(x, y))?.focus()
		}
	}

	const margin = Math.max(Math.ceil(cellSize / 30), 1)
	return (
		<div className='relative'>
			<input
				onFocus={(e) => e.target.select()}
				id={position}
				tabIndex={number ?? -1}
				autoComplete='off'
				value={letter}
				onKeyDown={handleOnKeyDown}
				style={{
					width: cellSize - margin * 2,
					height: cellSize - margin * 2,
					fontSize: cellSize / 2,
					borderRadius: cellSize / 10,
					margin,
				}}
				className={clsx(
					'text-center m-0.5 font-semibold flex items-center justify-center',
					solvedPositions.has(position) ? 'bg-violet-500 text-white' : 'bg-white'
				)}
			/>
			<span
				style={{ fontSize: Math.max(cellSize * 0.3) }}
				className={clsx('absolute top-px left-1 select-none', solvedPositions.has(position) && 'text-white')}
			>
				{number}
			</span>
		</div>
	)
}

export default Cell
