import { useCrossword } from 'providers/Crossword'
import { FC, useEffect } from 'react'

import Board from 'components/Board'
import Descriptions from 'components/Descriptions'

interface CrosswordGameProps {
	online?: boolean
}

const CrosswordGame: FC<CrosswordGameProps> = () => {
	const { board } = useCrossword()

	return board ? (
		<div className='flex flex-col md:flex-row justify-center items-center h-full min-h-screen'>
			{board ? (
				<>
					<Board />
					<Descriptions />
				</>
			) : null}
		</div>
	) : (
		<div className='flex w-full h-screen items-center justify-center'>
			<div className='w-12 h-12 rounded-full border-8 animate-spin border-violet-500 border-b-violet-200' />
		</div>
	)
}

export default CrosswordGame
