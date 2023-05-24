class Crossword {
	private _solvedBoard: Crossword.Board
	private _workingBoard: Crossword.Board
	private _directionMap: Map<string, Crossword.AutoFocusDirection> = new Map()
	private _previousDirection: Crossword.AutoFocusDirection = 'across'
	private _solvedPositions: Set<string> = new Set()
	private _solvedPhrases: Set<string> = new Set()

	public dimensions: Crossword.Dimensions

	private static _createMatrix({ width, height }: Crossword.Dimensions): null[][] {
		return new Array(height).fill(null).map((_) => new Array(width).fill(null))
	}

	public static toId(x: number, y: number): string
	public static toId(number: number, direction: Crossword.Direction): string
	public static toId(a: number, b: number | Crossword.Direction): string {
		return [a, b].join('/')
	}

	constructor(private _phrases: Crossword.Phrase[], private _onCellChange?: () => void, private _onSolveCrossword?: () => void) {
		this.dimensions = this._getBoardDimensions()
		this._createSolvedBoard()
		this._createEmptyBoard()
	}

	private _getPhraseCellIndexes(phrase: Crossword.Phrase) {
		const text = phrase.text.join('')
		const indexes: Crossword.Position[] = []
		for (let i = 0; i < text.length; i++) {
			const x = phrase.x + (phrase.direction === 'across' ? i : 0)
			const y = phrase.y + (phrase.direction === 'down' ? i : 0)

			indexes.push({ x, y })
		}
		return indexes
	}

	private _checkPhraseIsSolved(phrase: Crossword.Phrase) {
		return this._getPhraseCellIndexes(phrase).every(({ x, y }) => this._solvedBoard[y][x] === this._workingBoard[y][x])
	}

	private _getBoardDimensions(): Crossword.Dimensions {
		let width = 0
		let height = 0

		this._phrases.forEach((phrase) => {
			const { x, y } = phrase
			const textLength = phrase.text.join('').length
			switch (phrase.direction) {
				case 'across':
					width = Math.max(width, x + textLength)
					height = Math.max(height, y + 1)
					break
				case 'down':
					height = Math.max(height, y + textLength)
					width = Math.max(width, x + 1)
					break
			}
		})
		return { width, height }
	}

	private _createSolvedBoard() {
		const board: Crossword.Board = Crossword._createMatrix(this.dimensions)
		this._phrases.forEach((phrase) => {
			const word = phrase.text.join('').toUpperCase()
			word.split('').forEach((letter, i) => {
				const x = phrase.x + (phrase.direction === 'across' ? i : 0)
				const y = phrase.y + (phrase.direction === 'down' ? i : 0)

				const prevValue = board[y][x]
				if (prevValue === null) {
					board[y][x] = letter
				} else if (prevValue !== letter) {
					throw new Error(
						`Invalid crossword: Phrase '${phrase.text.join('/')}' overlaps incorrectly at point x=${x} y=${y} ${letter} -> ${prevValue}.`
					)
				}

				const position = Crossword.toId(x, y)
				if (this._directionMap.has(position)) {
					this._directionMap.set(position, 'both')
				} else {
					this._directionMap.set(position, phrase.direction === 'across' ? 'across' : 'down')
				}
			})
		})

		this._solvedBoard = board
	}

	private _createEmptyBoard() {
		const board: Crossword.Board = Crossword._createMatrix(this.dimensions)
		this._phrases.forEach((phrase) => {
			for (let i = 0; i < phrase.text.join('').length; i++) {
				const { x, y } = phrase
				switch (phrase.direction) {
					case 'across':
						board[y][x + i] = ''
						break
					case 'down':
						board[y + i][x] = ''
						break
				}
			}
		})

		this._workingBoard = board
	}

	public getBoard() {
		return this._workingBoard.slice()
	}

	public updateCell({ x, y }: Crossword.Position, value: string) {
		this._workingBoard[y][x] = value
		this._solvedPositions = new Set<string>()
		this._solvedPhrases = new Set<string>()

		this._phrases.forEach((phrase) => {
			if (this._checkPhraseIsSolved(phrase)) {
				this._solvedPhrases.add(Crossword.toId(phrase.number, phrase.direction))
				const positions = this._getPhraseCellIndexes(phrase).map(({ x, y }) => Crossword.toId(x, y))
				positions.forEach((position) => this._solvedPositions.add(position))
			}
		})

		const newDirection = this._directionMap.get(Crossword.toId(x, y))
		if (newDirection !== 'both') {
			this._previousDirection = newDirection
		}
		this._onCellChange?.()
	}

	public getNextCell({ x, y }: Crossword.Position) {
		const coords = Crossword.toId(x, y)
		let direction = this._directionMap.get(coords)

		if (direction === 'both') {
			direction = this._previousDirection
		}

		switch (direction) {
			case 'across':
				return { x: x + 1, y }
			case 'down':
				return { x, y: y + 1 }
			case 'both':
				return null
		}
	}

	public getPrevCell({ x, y }: Crossword.Position) {
		const coords = Crossword.toId(x, y)
		let direction = this._directionMap.get(coords)

		if (direction === 'both') {
			direction = this._previousDirection
		}

		switch (direction) {
			case 'across':
				return { x: x - 1, y }
			case 'down':
				return { x, y: y - 1 }
			case 'both':
				return null
		}
	}

	public getPreviousDirection() {
		return this._previousDirection
	}

	public getSolvedPositions() {
		return this._solvedPositions
	}

	public getSolvedPhrases() {
		return this._solvedPhrases
	}

	public setPreviousDirection(direction: Crossword.AutoFocusDirection) {
		this._previousDirection = direction
	}
}

namespace Crossword {
	export interface Position {
		x: number
		y: number
	}

	export interface Dimensions {
		width: number
		height: number
	}

	export type Direction = 'across' | 'down'

	export type AutoFocusDirection = Direction | 'both'

	export interface Phrase {
		number: number
		x: number
		y: number
		direction: Direction
		text: string[]
		description: string
	}
	export type Board = string[][]
}

export default Crossword
