export type ObserverType = {
	id: string
	function: Function
}

export type CommandFunctionGameType = {
	type: string
	state?: {}
}

export type GameType = {
	crashes: number[]
	gameOcurring: boolean
	currentTimeCrash: number
	timer: number
	curveControll: number
	lastCrash: number
	gameStatus: string
}
