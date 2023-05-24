import { useCrossword } from 'providers/Crossword'
import { FC, useEffect, useRef, useState } from 'react'
import { CellRow } from 'components'

interface BoardProps {}

const Board: FC<BoardProps> = () => {
	const { board } = useCrossword()
	const boardRef = useRef<HTMLDivElement>(null)
	const [cellSize, setCellSize] = useState<number>(0)

	useEffect(() => {
		const onResize = () => {
			setCellSize(Math.min((window.innerWidth - 24) / board[0].length, 40))
		}

		if (board) {
			window.addEventListener('resize', onResize)
			window.addEventListener('orientationchange', onResize)
			const interval = setInterval(onResize, 1000)

			onResize()
			return () => {
				clearInterval(interval)
				window.removeEventListener('orientationchange', onResize)
				window.removeEventListener('resize', onResize)
			}
		}
	}, [board])

	return (
		<div className='flex flex-col items-center'>
			<div ref={boardRef} className='flex flex-col bg-violet-200 p-1 rounded w-full'>
				{board.map((row, index) => (
					<CellRow cellSize={cellSize} key={index} letters={row} y={index} />
				))}
			</div>
		</div>
	)
}

export default Board
