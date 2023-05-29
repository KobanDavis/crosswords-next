import { Crossword } from 'lib'

export interface SelectCrossword {
	id: string
	name: string
	difficulty: 1 | 2 | 3
	puzzle: Crossword.Phrase[]
}
