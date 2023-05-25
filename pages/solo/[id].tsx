import { Board, Descriptions } from 'components'
import { useRouter } from 'next/router'
import { useCrossword } from 'providers/Crossword'
import { FC, useEffect } from 'react'
import _crosswords from 'crosswords.json'
import { SelectCrossword } from 'types'
import CrosswordGame from 'components/CrosswordGame'

const crosswords = _crosswords as SelectCrossword[]

const Crossword: FC = () => {
	const { loadCrossword } = useCrossword()
	const router = useRouter()
	const { id } = router.query

	useEffect(() => {
		if (id !== undefined) {
			const crossword = crosswords.find((crossword) => crossword.id === Number(id))
			loadCrossword(crossword.puzzle)
		}
	}, [id])

	return <CrosswordGame />
}

export default Crossword
