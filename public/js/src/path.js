"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const tsmonad_1 = require("tsmonad");
const map = [
    [0, 0, 0, 0],
    [0, 1, 1, 1],
    [0, 1, 0, 0],
    [0, 0, 0, 0]
];
const start = { x: 0, y: 0 };
const end = { x: 2, y: 2 };
const thing = [
    start
];
const isPointValid = (map) => (point) => {
    const { x, y } = point;
    return (x >= 0 && x < map.length && y >= 0 && y < map[0].length);
};
const findAdjacent = (map) => (point) => {
    if (!isPointValid(map)(point)) {
        return tsmonad_1.Maybe.nothing();
    }
    const { x, y } = point;
    return tsmonad_1.Maybe.just(map[x][y]);
};
const addToList = (list, point) => [point, ...list];
const squaresAround = (point) => {
    const { x, y } = point;
    return [
        { x: x - 1, y },
        { x: x + 1, y },
        { x, y: y - 1 },
        { x, y: y + 1 }
    ];
};
const checkAnswer = (list) => (point) => (tile) => {
    if (tile === 0) {
        return addToList(list, point);
    }
    return [];
};
const addAdjacent = (map) => (list) => (point) => {
    return findAdjacent(map)(point).caseOf({
        just: tile => checkAnswer(list)(point)(tile),
        nothing: () => []
    });
};
const filterDuplicates = (arr) => {
    const problems = arr.filter((item) => {
        const matching = arr.filter((checkItem) => {
            return pointMatch(item)(checkItem);
        });
        return (matching.length > 1);
    });
    return (problems.length < 1);
};
const pointMatch = (matchPoint) => (point) => (matchPoint.x == point.x && matchPoint.y == point.y);
const isInList = (list, point) => {
    const _pointMatch = pointMatch(point);
    return (list.filter(_pointMatch).length > 0);
};
const getMoveOptions = (map) => (list) => {
    const startPoint = list[0];
    const _addAdjacent = addAdjacent(map)(list);
    return squaresAround(startPoint)
        .map(_addAdjacent)
        .filter(entry => (entry.length > 0))
        .filter(filterDuplicates);
};
// try out all possible and return new list of options
const getMultipleMoveOptions = (map) => (lists) => {
    return _.flatMap(lists, list => {
        return getMoveOptions(map)(list);
    });
};
const findAnswer = (targetPoint) => (potentialAnswer) => (pointMatch(potentialAnswer[0])(targetPoint));
const findAnswerInList = (targetPoint) => (list) => {
    const _findAnswer = findAnswer(targetPoint);
    const found = _.find(list, _findAnswer);
    if (found) {
        return tsmonad_1.Maybe.just(found);
    }
    return tsmonad_1.Maybe.nothing();
};
const flipAnswer = (list) => _.reverse(list);
const processMoveList = (map) => (lists) => (targetPoint) => {
    const moveOptions = getMultipleMoveOptions(map)(lists);
    if (moveOptions.length === 0) {
        return tsmonad_1.Maybe.nothing();
    }
    const solution = findAnswerInList(targetPoint)(moveOptions);
    return solution.caseOf({
        just: value => {
            return tsmonad_1.Maybe.just(flipAnswer(value));
        },
        nothing: () => {
            return processMoveList(map)(moveOptions)(targetPoint);
        }
    });
};
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
};
