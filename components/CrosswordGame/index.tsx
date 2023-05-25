import { useCrossword } from 'providers/Crossword'
import { FC, useEffect } from 'react'

import Board from 'components/Board'
import Descriptions from 'components/Descriptions'

interface CrosswordGameProps {
	online?: boolean
}

const CrosswordGame: FC<CrosswordGameProps> = () => {
	const { board } = useCrossword()
	if (!board) return <div>loading spinner go brrrrr</div>
	return (
		<div className='flex flex-col md:flex-row justify-center items-center h-full min-h-screen'>
			{board ? (
				<>
					<Board />
					<Descriptions />
				</>
			) : null}
		</div>
	)
}

export default CrosswordGame
