import { AppProps } from 'next/app'
import { CrosswordProvider } from 'providers/Crossword'

import 'styles/globals.css'

const App = ({ Component, pageProps: { session, ...pageProps } }: AppProps) => {
	return (
		<CrosswordProvider>
			<Component {...pageProps} />
		</CrosswordProvider>
	)
}

export default App
