import React, { FC, useState } from 'react'
import { Crossword } from 'lib'
import { ArrowRightIcon, ArrowDownIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'
import Button from 'components/Button'

const directionIconMap = {
	across: <ArrowRightIcon className='h-4 w-4' />,
	down: <ArrowDownIcon className='h-4 w-4' />,
}

type WordMap = Record<number, Record<number, string>>
type Descriptions = Record<Crossword.Direction, Map<string, string>>

const Create: FC = () => {
	const [width, setWidth] = useState<number>(9)
	const [height, setHeight] = useState<number>(9)
	const [editDirection, setEditDirection] = useState<Crossword.Direction>('across')

	// y first
	const [acrossMap, setAcrossMap] = useState<WordMap>({})
	// x first
	const [downMap, setDownMap] = useState<WordMap>({})

	const updateMap = (x: number, y: number, letter: string) => {
		const update = (map: WordMap, a: number, b: number, letter: string) => {
			if (map[a] === undefined) {
				map[a] = {}
			}
			if (letter) {
				map[a][b] = letter.toUpperCase()
			} else {
				delete map[a][b]
			}
		}
		setAcrossMap((old) => {
			const acrossMap = Object.assign({}, old)
			update(acrossMap, y, x, letter)
			return acrossMap
		})
		setDownMap((old) => {
			const downMap = Object.assign({}, old)
			update(downMap, x, y, letter)
			return downMap
		})
		document.getElementById(Crossword.toId(editDirection === 'across' ? x + 1 : x, editDirection === 'across' ? y : y + 1))?.focus()
	}

	const [descriptions, setDescriptions] = useState<Descriptions>({ across: new Map(), down: new Map() })
	const updateDescription = (phrase: Partial<Crossword.Phrase>, text: string) => {
		setDescriptions((old) => {
			const descriptions = Object.assign({}, old)
			descriptions[phrase.direction].set(Crossword.toId(phrase.x, phrase.y), text)
			return descriptions
		})
	}
	const getPhrases = () => {
		const phrases: Partial<Crossword.Phrase>[] = []
		// haha
		const mapmap = {
			across: acrossMap,
			down: downMap,
		}
		Object.entries(mapmap).forEach(([direction, directionMap]) => {
			Object.entries(directionMap).forEach(([_a, map]) => {
				const a = Number(_a)
				let word = ''
				let init = null
				for (let b = 0; b < width + 1; b++) {
					const letter = map[b]
					if (init === null) {
						init = b
					}
					if (letter) {
						word += letter
					} else {
						if (word.length > 1) {
							phrases.push({
								text: [word],
								direction: direction as Crossword.Direction,
								description: descriptions[Crossword.toId(a, b)],
								x: direction === 'across' ? init : a,
								y: direction === 'across' ? a : init,
							})
						}
						init = null
						word = ''
					}
				}
			})
		})
		return phrases
	}

	const phrases = getPhrases()
	const numberMap = phrases
		.sort((a, b) => {
			if (a.y === b.y) return a.x - b.x
			return a.y - b.y
		})
		.reduce((map, phrase) => {
			const id = Crossword.toId(phrase.x, phrase.y)
			if (map.has(id)) return map
			return map.set(id, map.size + 1)
		}, new Map())

	const toPuzzle = () => {
		return phrases.map((phrase) => {
			const id = Crossword.toId(phrase.x, phrase.y)
			phrase.number = numberMap.get(id)
			phrase.description = descriptions[phrase.direction].get(id)
			return phrase
		})
	}

	return (
		<div>
			<div className='m-2'>
				{Array(height)
					.fill(0)
					.map((_, y) => (
						<div key={y} className='flex'>
							{Array(width)
								.fill(0)
								.map((_, x) => (
									<div key={x} className='relative'>
										<input
											id={Crossword.toId(x, y)}
											value={acrossMap?.[y]?.[x] ?? ''}
											onChange={(e) => updateMap(x, y, e.target.value.charAt(e.target.value.length - 1))}
											onFocus={(e) => e.target.select()}
											autoComplete='off'
											className='text-lg text-center m-0.5 font-semibold flex items-center justify-center bg-white w-8 h-8'
										/>
										<span className='text-xs absolute top-px left-1 select-none'>{numberMap.get(Crossword.toId(x, y))}</span>
									</div>
								))}
						</div>
					))}
			</div>
			<Button className='m-2' onClick={() => setEditDirection(editDirection === 'across' ? 'down' : 'across')}>
				{editDirection.toUpperCase()}
			</Button>
			<label className='flex m-2'>
				Width:
				<input type='number' onChange={(e) => setWidth(Number(e.target.value))} value={width} />
			</label>
			<label className='flex m-2'>
				Height:
				<input type='number' onChange={(e) => setHeight(Number(e.target.value))} value={height} />
			</label>
			<div className='flex flex-col'>
				<span className='font-bold m-2'>Descriptions</span>
				{['across', 'down'].map((direction) => (
					<div key={direction} className='flex flex-col py-2 px-4 rounded shadow-inner bg-violet-50 m-1'>
						<div className='flex items-center font-bold text-lg'>
							<span className='mr-1'>{direction.toUpperCase()}</span>
							{directionIconMap[direction]}
						</div>
						{phrases
							.filter((phrase) => phrase.direction === direction)
							.map((phrase) => {
								const id = Crossword.toId(phrase.x, phrase.y)
								return (
									<div key={phrase.number} className='flex items-start select-none'>
										<div className='font-semibold mr-2'>{numberMap.get(id)}.</div>
										<input
											className='px-1'
											onChange={(e) => updateDescription(phrase, e.target.value)}
											value={descriptions[direction].get(id)}
										/>
									</div>
								)
							})}
					</div>
				))}
			</div>
			<Button className='m-2' onClick={() => console.log(toPuzzle())}>
				Log
			</Button>
		</div>
	)
}

export default Create
