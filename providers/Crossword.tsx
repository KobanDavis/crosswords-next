import { Crossword } from 'lib'
import { useState, useContext, createContext, useCallback, useMemo } from 'react'
import type { FC, ReactNode } from 'react'

interface CrosswordContextType {
	crossword: Crossword
	board: Crossword.Board
	phrases: Crossword.Phrase[]
	numberPositionMap: any
	solvedPositions: Set<string>
	solvedPhrases: Set<string>
	loadCrossword(phrases: Crossword.Phrase[], positions?: Record<string, string>): void
	setOnCellChange(fn: (position: Crossword.Position, value: string) => void): void
	onCellChange(position: Crossword.Position, value: string): void
}

const CrosswordProvider: FC<{ children: ReactNode }> = (props) => {
	const [crossword, setCrossword] = useState<Crossword>(null)
	const [phrases, setPhrases] = useState<Crossword.Phrase[]>(null)
	const [solvedPositions, setSolvedPositions] = useState<Set<string>>(new Set())
	const [solvedPhrases, setSolvedPhrases] = useState<Set<string>>(new Set())
	const [board, setBoard] = useState<Crossword.Board>(null)
	const [onCellChange, setOnCellChange] = useState<(position: Crossword.Position, letter: string) => void>(null)

	const loadCrossword = useCallback((phrases: Crossword.Phrase[], positions: Record<string, string> = {}) => {
		const crossword = new Crossword(phrases, () => {
			setBoard(crossword.getBoard())
			setSolvedPositions(crossword.getSolvedPositions())
			setSolvedPhrases(crossword.getSolvedPhrases())
		})
		console.log(positions)
		Object.entries(positions).forEach(([position, letter]) => crossword.updateCell(Crossword.toCoords(position), letter))

		setCrossword(crossword)
		setPhrases(phrases)
		setBoard(crossword.getBoard())
		setSolvedPositions(crossword.getSolvedPositions())
		setSolvedPhrases(crossword.getSolvedPhrases())
	}, [])

	const numberPositionMap = useMemo(() => {
		return (
			phrases?.reduce<any>((map, { x, y, number }) => {
				map[Crossword.toId(x, y)] = number
				map[number] = Crossword.toId(x, y)
				return map
			}, {}) ?? {}
		)
	}, [phrases])

	return (
		<Context.Provider
			value={{
				crossword,
				board,
				phrases,
				numberPositionMap,
				solvedPositions,
				solvedPhrases,
				loadCrossword,
				setOnCellChange: (cb) => setOnCellChange(() => cb),
				onCellChange,
			}}
			{...props}
		/>
	)
}

const Context = createContext<CrosswordContextType>(null)

const useCrossword = () => useContext(Context)

export { CrosswordProvider, useCrossword }
