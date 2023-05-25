import { FC } from 'react'
import { Board, Descriptions, Loading } from 'components'
import { useCrossword } from 'providers/Crossword'

interface CrosswordGameProps {
	online?: boolean
}

const CrosswordGame: FC<CrosswordGameProps> = () => {
	const { board } = useCrossword()

	return (
		<div className='flex flex-col md:flex-row justify-center items-center h-full min-h-screen'>
			{board ? (
				<>
					<Board />
					<Descriptions />
				</>
			) : (
				<Loading size={12} />
			)}
		</div>
	)
}

export default CrosswordGame
