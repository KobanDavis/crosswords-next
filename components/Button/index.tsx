import clsx from 'clsx'
import { FC } from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const Button: FC<ButtonProps> = ({ className, ...props }) => {
	return (
		<button
			className={clsx(
				'flex items-center rounded px-2 py-0.5 border-2',
				'border-violet-500 bg-violet-50 text-violet-500',
				'hover:text-white hover:bg-violet-500',
				'active:bg-violet-600 active:text-white active:border-violet-600',
				'disabled:bg-violet-50 disabled:border-violet-50 disabled:text-violet-300 disabled:cursor-not-allowed',
				className
			)}
			{...props}
		/>
	)
}

export default Button
