const path = require("../src/path");
const { Maybe } = require('tsmonad');
const assert = require('assert')

describe("Path finding", function() {
	
	describe("isPointValid", function() {
		it("Finds invalid place on map", function() {
			
			const map = [
				[0,0,0,0],
				[0,1,1,1],
				[0,1,0,0],
				[0,0,0,0],
				[0,0,0,0]
			]

			const offLeft = path.isPointValid(map)({x:-1,y:0})
			assert.equal(offLeft, false)

			const offTop = path.isPointValid(map)({x:0,y:-1})
			assert.equal(offTop, false)

			const offRight = path.isPointValid(map)({x:5,y:0})
			assert.equal(offRight, false)

			const offBottom = path.isPointValid(map)({x:0,y:4})
			assert.equal(offBottom, false)
		})	

		it("Finds valid place on map", function() {
			
			const map = [
				[0,0,0,0],
				[0,1,1,1],
				[0,1,0,0],
				[0,0,0,0],
				[0,0,0,0]
			]

			const topLeft = path.isPointValid(map)({x:0,y:0})
			assert.equal(topLeft, true)

			const topRight = path.isPointValid(map)({x:0,y:3})
			assert.equal(topRight, true)

			const bottomLeft = path.isPointValid(map)({x:4,y:0})
			assert.equal(bottomLeft, true)

			const bottomRight = path.isPointValid(map)({x:4,y:3})
			assert.equal(bottomRight, true)
		})	
	})

	describe("findAdjacent", function() {

		it("Returns a valid map point", function() {

			const map = [
				[1,2],
				[3,4]
			]

			const value1 = path.findAdjacent(map)({x:0, y:0})
			assert.deepEqual(value1, Maybe.just(1))

			const value2 = path.findAdjacent(map)({x:0, y:1})
			assert.deepEqual(value2, Maybe.just(2))

			const value3 = path.findAdjacent(map)({x:1, y:0})
			assert.deepEqual(value3, Maybe.just(3))

			const value4 = path.findAdjacent(map)({x:1, y:1})
			assert.deepEqual(value4, Maybe.just(4))

		})

		it("Returns false for invalid map point", function() {

			const map = [
				[1,2],
				[3,4]
			]

			const valueFalse = path.findAdjacent(map)({x:-1, y:0})
			assert.deepEqual(valueFalse, Maybe.nothing())

		})

	})

	describe("addAdjacent", function() {
		it("Finds a previously used point", function() {

			const map = [
				[0,0,0],
				[0,1,0],
				[0,0,0]
			]

			const list = [{x:1, y:0}, {x: 0, y:0}]

			const point = {x:0, y:0}

			const expected = [{x:0, y:0},{x:1, y:0}, {x:0, y:0}]

			const actual = path.addAdjacent(map)(list)(point)
			
			assert.deepEqual(actual, expected)
		})

		it("Finds an unavailable point", function() {

			const map = [
				[0,1,0],
				[0,1,0],
				[0,0,0]
			]

			const list = [{x: 0, y:0}]

			const point = {x: 0, y:1}

			const expected = []

			const actual = path.addAdjacent(map)(list)(point)
			
			assert.deepEqual(actual, expected)

		})
	})
	
	describe("removeDuplicates", function() {
		it("Gets rid of those duplicates", function() {

			const list = [{x:0, y:1}, {x:0, y:0}, {x:0, y:1}]

			const expected = false

			const actual = path.filterDuplicates(list)
			
			assert.equal(actual, expected)
		})

		it("Leaves those non-duplicates", function() {

			const list = [{x:0, y:1}, {x:0, y:0}, {x:0, y:2}]

			const expected = true

			const actual = path.filterDuplicates(list)

			assert.deepEqual(actual, expected)
		})
	})

	describe("addToThing", function() {
		it("Adds to empty list", function() {
			const list = []

			const point = {x:1, y:0}

			const expected = [{x:1, y:0}]

			const actual = path.addToList(list, point)

			assert.deepEqual(actual, expected)
		})

		it("Adds to small list", function() {
			const list = [{x:1, y:0},{x:0, y:0}]

			const point = {x:1, y:1}

			const expected = [{x:1,y:1},{x:1,y:0},{x:0,y:0}]

			const actual = path.addToList(list, point)

			assert.deepEqual(actual, expected)
		})
	})

	describe("squaresAround", function() {
		it("Finds them all", function() {
			const point = {x:0,y:0}

			const expected = [
				{x:-1, y:0},
				{x:1, y:0},
				{x:0, y:-1},
				{x:0, y:1}
			]

			const actual = path.squaresAround(point)

			assert.deepEqual(expected, actual)
		})
	})

	describe("isInList", function() {
		it("Finds one that is", function() {
			const point = {x:0,y:0}

			const list = [
				{x:0,y:0},
				{x:1,y:0}
			]

			const found = path.isInList(list, point)

			assert.equal(found, true)
		})

		it("Finds one that isn't", function() {
			const point = {x:4,y:0}

			const list = [
				{x:0,y:0},
				{x:1,y:0}
			]

			const found = path.isInList(list, point)

			assert.equal(found, false)
		})
	})

	describe("getMoveOptions", function() {
		it("Finds only option from starting point", function() {
			
			const map = [
				[0,1,0,0],
				[0,1,1,1],
				[0,1,0,0],
				[0,0,0,0]
			]

			const list = [{x:0,y:0}]

			const expected = [
				[{x:1,y:0},{x:0,y:0}]
			]
				
			const actual = path.getMoveOptions(map)(list)

			assert.deepEqual(actual, expected)

		})

		it("Doesn't go back on itself", function() {
			
			const map = [
				[0,1,0,0],
				[0,1,1,1],
				[0,1,0,0],
				[0,0,0,0]
			]

			const list = [{x:1, y:0},{x:0, y:0}]

			const expected = [
				[{x:2, y:0}, {x:1, y:0}, {x:0, y:0}]
			]
				
			const actual = path.getMoveOptions(map)(list)

			assert.deepEqual(actual, expected)

		}),

		it("Returns multiple options", function() {
			
			const map = [
				[0,1],
				[0,1],
				[0,1]
			]

			const list = [{x:1,y:0}]

			const expected = [
				[{x:0,y:0},{x:1,y:0}],
				[{x:2,y:0},{x:1,y:0}]
			]
				
			const actual = path.getMoveOptions(map)(list)

			assert.deepEqual(actual, expected)

		})
	})

	describe("findAnswerInList", function() {
		it ("Finds one", function() {

			const target = {x:2,y:2}

			const list = [
				[{x:1,y:2},{x:3,y:4}],
				[{x:2,y:1},{x:3,y:4}],
				[{x:1,y:2},{x:3,y:4}],
				[{x:2,y:2},{x:3,y:4}]
			]

			const expected = Maybe.just([{x:2,y:2},{x:3,y:4}])

			const actual = path.findAnswerInList(target)(list)

			assert.deepEqual(actual, expected)
		})

		it ("Finds nothing", function() {

			const target = {x:7,y:9}

			const list = [
				[{x:1, y:2},{x:3, y:4}],
				[{x:2, y:1},{x:3, y:4}],
				[{x:1, y:2},{x:3, y:4}],
				[{x:2, y:2},{x:3, y:4}]
			]

			const expected = Maybe.nothing()

			const actual = path.findAnswerInList(target)(list)

			assert.deepEqual(actual, expected)
		})
	})

	describe("It does the whole thing", function() {
		it ("Very quickly fails", function() {
			const map = [
				[0,1,0,0],
				[1,1,1,1],
				[0,1,0,0],
				[0,0,0,0]
			]

			const _processMoveList = path.processMoveList(map)

			const start = {x:0,y:0}

			const end = {x:2,y:2}

			const expected = Maybe.nothing();

			const startList = [[start]]

			const actual = path.processMoveList(map)(startList)(end)

			assert.deepEqual(actual, expected)
		})

		it ("Very quickly wins", function() {
			const map = [
				[0,1],
				[0,1],
			]

			const _processMoveList = path.processMoveList(map)

			const start = {x:0,y:0}

			const end = {x:1,y:0}

			const expected = Maybe.just([{x:0,y:0},{x:1,y:0}])

			const startList = [[start]]

			const actual = path.processMoveList(map)(startList)(end)

			assert.deepEqual(actual, expected)
		})

		
		it ("Wins I suppose", function() {
			const map = [
				[0,0,0,0],
				[0,1,1,1],
				[0,1,0,0],
				[0,0,0,0]
			]

			const start = {x:0,y:0}

			const end = {x:2,y:2}

			const expected = Maybe.just([
				{x:0,y:0},
				{x:1,y:0},
				{x:2,y:0},
				{x:3,y:0},
				{x:3,y:1},
				{x:3,y:2},
				{x:2,y:2}
			]);

			const startList = [[start]]

			const actual = path.processMoveList(map)(startList)(end)

			assert.deepEqual(actual, expected)
		})

		
		it ("Wins another map", function() {
			
			const map = [
				[0,0,0,1],
				[1,1,0,1],
				[0,0,0,1]
			]

			const start = {x:2, y:0}

			const end = {x:0, y:0}

			const expected = Maybe.just([
				{x:2, y:0},
				{x:2, y:1},
				{x:2, y:2},
				{x:1, y:2},
				{x:0, y:2},
				{x:0, y:1},
				{x:0, y:0}
			]);

			const startList = [[start]]

			const actual = path.processMoveList(map)(startList)(end)

			assert.deepEqual(actual, expected)
		})

		it ("Wins a silly map", function() {
			
			const map = [
				[0,0,0,1],
				[1,1,0,1],
				[0,0,0,1],
				[0,1,1,1],
				[0,0,0,1],
				[1,1,0,1],
				[0,0,0,1],
				[0,1,1,1],
				[0,1,0,1],
				[0,0,0,1],
				[0,1,0,1],
				[0,1,0,0]
			]

			const start = {x:0, y:0}

			const end = {x:11, y:3}

			const expectedLength = 23

			const startList = [[start]]

			const actual = path.processMoveList(map)(startList)(end)

			const value = actual.caseOf({
				just: value => value,
				nothing: () => false
			})

			assert.equal(value.length, expectedLength)
		})
	})
	
})