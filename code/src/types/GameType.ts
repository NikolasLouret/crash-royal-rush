export type ObserverType = {
	id: string
	function: Function
}

export type CommandFunctionGameType = {
	type: string
	state?: GameType
}

export type CommandFunctionViewerType = {
	type: string
	status: GameStatus
}

export type GameType = {
	crashes: number[]
	gameOcurring: boolean
	currentTimeCrash: number
	timer: number
	curveControll: number
	lastCrash: number
}

export type GameStatus = {
	crashes?: number[]
	isGameOcurring: boolean
}
