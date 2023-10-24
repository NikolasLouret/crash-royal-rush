export type ObserverType = {
	id: string
	function: (viewe: CommandFunctionType) => void
}

export type CommandFunctionType = {
	type: string
	state: GameType
}

export type GameType = {
	timeCrash: number
	isCrashed: boolean
	currentTimeCrash: number
	timer: number
	curveControll: number
}
