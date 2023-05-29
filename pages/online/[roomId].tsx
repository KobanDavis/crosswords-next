import { useRouter } from 'next/router'
import { useCrossword } from 'providers/Crossword'
import { FC, useEffect, useRef, useState } from 'react'
import { io } from 'socket.io-client'
import _crosswords from 'crosswords.json'
import { SelectCrossword } from 'types'
import CrosswordGame from 'components/CrosswordGame'
import { Crossword } from 'lib'

const crosswords = _crosswords as SelectCrossword[]

const Online: FC = () => {
	const socketRef = useRef(io(process.env.NEXT_PUBLIC_BACKEND_URL))
	const socket = socketRef.current

	const router = useRouter()
	const { loadCrossword, setOnCellChange, crossword } = useCrossword()
	const [connected, setConnected] = useState<boolean>(null)

	const { roomId } = router.query

	useEffect(() => {
		if (roomId !== undefined) {
			socket.emit('join_room', { roomId, player: { id: localStorage.getItem('uuid'), name: 'player', crosswordId: 0 } }, setConnected)
			socket.once('init', ({ positions, crosswordId }) => {
				const crossword = crosswords.find((crossword) => crossword.id === crosswordId)
				loadCrossword(crossword.puzzle, positions)
			})
		}
	}, [roomId])

	useEffect(() => {
		if (connected) {
			setOnCellChange((position, letter) => {
				console.log('send', position, letter)
				socket.emit('letter', { position: Crossword.toId(position.x, position.y), letter })
			})
			socket.on('letter', ({ position, letter }) => {
				crossword.updateCell(Crossword.toCoords(position), letter)
			})
		}
	}, [connected])

	return <CrosswordGame />
}

export default Online
