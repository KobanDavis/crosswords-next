import { Crossword } from 'lib'
import { useCrossword } from 'providers/Crossword'
import { FC, useMemo } from 'react'
import { ArrowRightIcon, ArrowDownIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'

const directionIconMap = {
	[Crossword.Direction.ACROSS]: <ArrowRightIcon className='h-4 w-4' />,
	[Crossword.Direction.DOWN]: <ArrowDownIcon className='h-4 w-4' />,
}

interface DescriptionsProps {}

const Descriptions: FC<DescriptionsProps> = (props) => {
	const { phrases, crossword, numberPositionMap, solvedPhrases } = useCrossword()

	const phrasesByDirection = useMemo(() => {
		return phrases?.reduce<Record<Crossword.Direction, Crossword.Phrase[]>>((map, phrase) => {
			if (phrase.direction in map) {
				map[phrase.direction].push(phrase)
			} else {
				map[phrase.direction] = [phrase]
			}
			return map
		}, {} as any)
	}, [phrases])

	return (
		<div className='flex mt-2 max-sm:flex-col md:flex-col md:ml-4'>
			{Object.entries(phrasesByDirection).map(([direction, phrases]) => (
				<div key={direction} className='flex flex-col py-2 px-4 rounded shadow-inner bg-violet-50 m-1'>
					<div className='flex items-center font-bold text-lg'>
						<span className='mr-1'>{Crossword.Direction[Number(direction) as Crossword.Direction]}</span>
						{directionIconMap[Number(direction) as Crossword.Direction]}
					</div>
					{phrases.map((phrase) => (
						<div
							onClick={() => {
								crossword.setPreviousDirection(phrase.direction as any)
								document.getElementById(numberPositionMap[phrase.number]).focus()
							}}
							key={phrase.number}
							className={clsx(
								'flex items-start select-none',
								solvedPhrases.has(Crossword.toId(phrase.number, phrase.direction)) ? 'text-green-500 ' : 'cursor-pointer'
							)}
						>
							<div className='flex items-center'>
								{solvedPhrases.has(Crossword.toId(phrase.number, phrase.direction)) ? (
									<CheckIcon className='shrink-0 w-4 h-4 text-green-500 stroke-[3] mr-1' />
								) : (
									<XMarkIcon className='shrink-0 w-4 h-4 text-violet-400 stroke-[3] mr-1' />
								)}
								<span className='font-semibold mr-1'>{phrase.number}.</span>
							</div>
							<span>{phrase.description}</span>
						</div>
					))}
				</div>
			))}
		</div>
	)
}

export default Descriptions
