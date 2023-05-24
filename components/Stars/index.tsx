import { StarIcon } from '@heroicons/react/24/solid'
import clsx from 'clsx'
import { FC } from 'react'

interface StarsProps {
	count: number
	value: number
}

const Stars: FC<StarsProps> = ({ count, value }) => {
	return (
		<div className='flex'>
			{Array(count)
				.fill(null)
				.map((_, i) => (
					<StarIcon key={i} className={clsx('h-4 w-4', value - 1 >= i ? 'text-yellow-300' : 'text-black/20')} />
				))}
		</div>
	)
}

export default Stars
