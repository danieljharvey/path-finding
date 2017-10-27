const _ = require('lodash')

const map = [
	[0,0,0,0],
	[0,1,1,1],
	[0,1,0,0],
	[0,0,0,0]
]

const start = [0,0]

const end = [2,2]

const thing = [
	start
]

const isPointValid = map => point => {
	const [x,y] = point
	return (x >= 0 && x < map.length && y >= 0  && y < map[0].length)
}

const findAdjacent = map => point => {
	if (!isPointValid(map)(point)) {
		return false
	}
	const [x,y] = point
	return map[x][y]
}

const addToList = (list, point) => [point, ...list]

const squaresAround = point => {
	const [x, y] = point
	return [
		[x - 1, y],
		[x + 1, y],
		[x, y - 1],
		[x, y + 1]
	]
}

const addAdjacent = map => list => point => {
	
	const tile = findAdjacent(map)(point)
	if (tile === 0) {
		return addToList(list, point)
	} else {
		return []
	}
}

const filterDuplicates = arr => {
	const reduced = arr.reduce((sum, value) => {
		if (sum === false || isInList(sum,value)) {
			return false
		}
		return [...sum, value]
	}, [])
	return (reduced !== false)
}

const pointMatch = matchPoint => point => (matchPoint[0]==point[0] && matchPoint[1]==point[1])

const isInList = (list, point) => {
	const _pointMatch = pointMatch(point)
	return (list.filter(_pointMatch).length)
}

const getMoveOptions = map => list => {
	const startPoint = list[0];
	const _addAdjacent = addAdjacent(map)(list)
	return squaresAround(startPoint)
			.map(_addAdjacent)
			.filter(entry => (entry !== false && entry.length >0))
			.filter(filterDuplicates)
}

const combineMoveOptions = moveOptions => {
	return _.flatten(_.reduce((total, lists) => {
		return [...total, ...lists]
	}, [], moveOptions))
}

// try out all possible and return new list of options
const getMultipleMoveOptions = map => lists => {
	return combineMoveOptions(_.map(lists, list => {
		const moveOptions = getMoveOptions(map)(list)
		return moveOptions
	}))
}

const findAnswer = targetPoint => potentialAnswer => (pointMatch(potentialAnswer[0])(targetPoint))

const findAnswerInList = targetPoint => list => {
	const _findAnswer = findAnswer(targetPoint)
	return _.find(list, _findAnswer)
}

const flipAnswer = list => _.reverse(list)

const processMoveList = map => lists => targetPoint => {
	const moveOptions = getMultipleMoveOptions(map)(lists)

	if (moveOptions.length === 0) {
		return false // run out of road
	}

	const solution = findAnswerInList(targetPoint)(moveOptions)
	if (solution) {
		return flipAnswer(solution)
	}
	// have more to try, run again
	return processMoveList(map)(moveOptions)(targetPoint)
}

module.exports = {
	squaresAround,
	getMoveOptions,
	addToList,
	filterDuplicates,
	findAdjacent,
	addAdjacent,
	isPointValid,
	isInList,
	combineMoveOptions,
	processMoveList,
	findAnswerInList
}