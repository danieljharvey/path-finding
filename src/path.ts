import * as _ from 'lodash'
import { Maybe } from 'tsmonad';

interface Point {
	x: number
	y: number
}

type PointList = Array<Point>

type PointPile = Array<Array<PointList>>

type Map = Array<Array<Number>>

const map: Map = [
	[0,0,0,0],
	[0,1,1,1],
	[0,1,0,0],
	[0,0,0,0]
]

const start: Point = {x:0,y:0}

const end: Point = {x:2,y:2}

const thing = [
	start
]

const isPointValid = (map: Map) => (point: Point) : Boolean => {
	const {x, y} = point
	return (x >= 0 && x < map.length && y >= 0  && y < map[0].length)
}

const findAdjacent = (map: Map) => (point: Point) : Maybe<Number> => {
	if (!isPointValid(map)(point)) {
		return Maybe.nothing()
	}
	const {x,y} = point
	return Maybe.just(map[x][y])
}

const addToList = (list: PointList, point: Point) : PointList => [point, ...list]

const squaresAround = (point: Point) : PointList => {
	const {x, y} = point
	return [
		{x: x - 1, y},
		{x: x + 1, y},
		{x, y: y - 1},
		{x, y: y + 1}
	]
}

const checkAnswer = (list: PointList) => (point: Point) => (tile: Number) : PointList => {
	if (tile === 0) {
		return addToList(list, point)
	}
	return []
}

const addAdjacent = (map: Map) => (list: PointList) => (point: Point) : PointList => {
	return findAdjacent(map)(point).caseOf({
		just: tile => checkAnswer(list)(point)(tile),
		nothing: () => []
	})
}

const filterDuplicates = (arr: PointList) : Boolean => {
	const problems = arr.filter((item: Point) => {
		const matching = arr.filter((checkItem: Point) => {
			return pointMatch(item)(checkItem);
		})
		return (matching.length > 1)
	})
	return (problems.length < 1)
}

const pointMatch = (matchPoint: Point) => (point: Point) => (matchPoint.x==point.x && matchPoint.y==point.y)

const isInList = (list: PointList, point: Point) : Boolean => {
	const _pointMatch = pointMatch(point)
	return (list.filter(_pointMatch).length > 0)
}

const getMoveOptions = (map: Map) => (list: PointList) : Array<PointList> => {
	const startPoint = list[0];
	const _addAdjacent = addAdjacent(map)(list)
	return squaresAround(startPoint)
			.map(_addAdjacent)
			.filter(entry => (entry.length > 0))
			.filter(filterDuplicates)
}

// try out all possible and return new list of options
const getMultipleMoveOptions = (map: Map) => (lists: Array<PointList>) : Array<PointList> => {
	return _.flatMap(lists, list => {
		return getMoveOptions(map)(list)
	})
}

const findAnswer = (targetPoint: Point) => (potentialAnswer: PointList) => (pointMatch(potentialAnswer[0])(targetPoint))

const findAnswerInList = (targetPoint: Point) => (list: Array<PointList>) : Maybe<PointList> => {
	const _findAnswer = findAnswer(targetPoint)
	const found = _.find(list, _findAnswer)
	if (found) {
		return Maybe.just(found)
	}
	return Maybe.nothing()
}

const flipAnswer = (list: PointList) => _.reverse(list)

const processMoveList = (map: Map) => (lists: Array<PointList>) => (targetPoint: Point) : Maybe<PointList> => {
	const moveOptions = getMultipleMoveOptions(map)(lists)

	if (moveOptions.length === 0) {
		return Maybe.nothing()
	}

	const solution = findAnswerInList(targetPoint)(moveOptions)

	return solution.caseOf({
		just: value => {
			return Maybe.just(flipAnswer(value))
		},
		nothing: () => {
			return processMoveList(map)(moveOptions)(targetPoint)
		}
	})
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
	processMoveList,
	findAnswerInList
}