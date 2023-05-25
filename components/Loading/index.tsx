import clsx from 'clsx'
import { FC } from 'react'

interface LoadingProps extends React.HTMLAttributes<HTMLDivElement> {
	size?: number
}

const Loading: FC<LoadingProps> = ({ size = 4, className, ...props }) => {
	return (
		<div
			style={{
				width: size * 4,
				height: size * 4,
				borderWidth: (size * 2) / 3,
			}}
			className={clsx('rounded-full animate-spin border-violet-500 border-b-violet-200', className)}
			{...props}
		/>
	)
}

export default Loading
