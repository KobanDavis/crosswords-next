import { FC, useEffect, useMemo, useState } from 'react'

import _crosswords from 'crosswords.json'
import clsx from 'clsx'
import { Stars } from 'components'
import { SelectCrossword } from 'types'
import { ArrowRightIcon, CheckIcon, ArrowUturnLeftIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Button from 'components/Button'

type Mode = 'solo' | 'online'

const crosswords = _crosswords as SelectCrossword[]

const difficultyMap = {
	1: 'Easy',
	2: 'Medium',
	3: 'Hard',
}

const Home: FC = () => {
	const router = useRouter()
	const [crosswordId, setCrosswordId] = useState<number>(null)
	const [mode, setMode] = useState<Mode>('solo')
	const [hideCompleted, setHideCompleted] = useState<boolean>(false)
	const [completedPuzzles, setCompletedPuzzles] = useState(new Set<number>())

	useEffect(() => {
		const completedPuzzles = JSON.parse(localStorage.getItem('completedPuzzles'))
		setCompletedPuzzles(new Set(completedPuzzles))
	}, [])

	const startCrossword = () => {
		router.push(`/${mode}/${crosswordId}`)
	}

	const handleCrosswordClick = (id: number) => {
		setCrosswordId(id === crosswordId ? null : id)
	}

	const puzzleIsComplete = completedPuzzles.has(crosswordId)

	let puzzles = crosswords
	if (hideCompleted) {
		puzzles = puzzles.filter((_, i) => !completedPuzzles.has(i))
	}
	return (
		<div className='flex flex-col w-full items-center h-screen p-4 overflow-hidden space-y-4'>
			<div className='flex justify-between self-start text-black/50 w-full'>
				<span className='font-bold text-violet-500'>Crosswords</span>
				<label>
					Hide completed?
					<input className='accent-violet-500 ml-2' type='checkbox' checked={hideCompleted} onChange={() => setHideCompleted(!hideCompleted)} />
				</label>
			</div>
			<div className='w-full shadow-inner bg-violet-200 flex-1 flex-shrink overflow-y-auto'>
				<div className='grid grid-cols-[repeat(auto-fill,_minmax(12rem,1fr))] overflow-hidden min-h-0 flex-1 gap-4 w-full p-4 justify-items-center'>
					{puzzles.map((crossword) => (
						<div
							onClick={() => handleCrosswordClick(crossword.id)}
							key={crossword.name}
							className={clsx(
								'w-full flex flex-col shadow rounded py-2 px-3 select-none cursor-pointer',
								crosswordId === crossword.id ? 'bg-violet-500 text-white' : 'bg-white'
							)}
						>
							<span className='font-semibold leading-snug'>{crossword.name}</span>
							<div className='flex flex-col h-full justify-between'>
								<div className='flex items-center my-1'>
									<Stars count={3} value={crossword.difficulty} />
									<span className={clsx('ml-1 text-xs', crosswordId === crossword.id ? 'text-white/50' : 'text-black/50')}>
										{difficultyMap[crossword.difficulty]}
									</span>
								</div>
								<div className='flex w-full justify-between'>
									<div className='text-xs 1'>{crossword.puzzle.length} phrases</div>
									{completedPuzzles.has(crossword.id) ? (
										<CheckIcon className={clsx('h-4 w-4 stroke-[3]', crosswordId === crossword.id ? 'text-white' : 'text-violet-500')} />
									) : null}
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
			<div className='justify-items-end self-end flex max-sm:flex-col max-sm:self-auto items-center max-sm:space-y-2'>
				<div className='flex items-center sm:mr-4'>
					<Button className={clsx('rounded-r-none border-r-0', mode === 'solo' && 'bg-violet-500 text-white')} onClick={() => setMode('solo')}>
						Solo
					</Button>
					<Button className={clsx('rounded-l-none border-l-0', mode === 'online' && 'bg-violet-500 text-white')} onClick={() => setMode('online')}>
						Online
					</Button>
				</div>
				<Button disabled={crosswordId === null} onClick={startCrossword}>
					<span className='mr-1'>{puzzleIsComplete ? 'Retry crossword' : 'Start crossword'}</span>
					{puzzleIsComplete ? <ArrowUturnLeftIcon className='w-4 h-4' /> : <ArrowRightIcon className='w-4 h-4' />}
				</Button>
			</div>
		</div>
	)
}

export default Home
