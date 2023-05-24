import { Board, Descriptions } from 'components'
import { useRouter } from 'next/router'
import { useCrossword } from 'providers/Crossword'
import { FC, useEffect } from 'react'
import _crosswords from 'crosswords.json'
import { SelectCrossword } from 'types'

const crosswords = _crosswords as SelectCrossword[]

const Crossword: FC = () => {
	const { loadCrossword, board } = useCrossword()
	const router = useRouter()
	const { id } = router.query

	useEffect(() => {
		if (id !== undefined) {
			const crossword = crosswords.find((crossword) => crossword.id === Number(id))
			loadCrossword(crossword.puzzle)
		}
	}, [id])

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

export default Crossword
