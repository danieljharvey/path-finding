const path = require("../path");

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

			const offLeft = path.isPointValid(map)([-1,0])
			assert.equal(offLeft, false)

			const offTop = path.isPointValid(map)([0,-1])
			assert.equal(offTop, false)

			const offRight = path.isPointValid(map)([5,0])
			assert.equal(offRight, false)

			const offBottom = path.isPointValid(map)([0,4])
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

			const topLeft = path.isPointValid(map)([0,0])
			assert.equal(topLeft, true)

			const topRight = path.isPointValid(map)([0,3])
			assert.equal(topRight, true)

			const bottomLeft = path.isPointValid(map)([4,0])
			assert.equal(bottomLeft, true)

			const bottomRight = path.isPointValid(map)([4,3])
			assert.equal(bottomRight, true)
		})	
	})

	describe("findAdjacent", function() {

		it("Returns a valid map point", function() {

			const map = [
				[1,2],
				[3,4]
			]

			const value1 = path.findAdjacent(map)([0,0])
			assert.equal(value1, 1)

			const value2 = path.findAdjacent(map)([0,1])
			assert.equal(value2, 2)

			const value3 = path.findAdjacent(map)([1,0])
			assert.equal(value3, 3)

			const value4 = path.findAdjacent(map)([1,1])
			assert.equal(value4, 4)

		})

		it("Returns false for invalid map point", function() {

			const map = [
				[1,2],
				[3,4]
			]

			const valueFalse = path.findAdjacent(map)([-1,0])
			assert.equal(valueFalse, false)

		})

	})

	describe("addAdjacent", function() {
		it("Finds a previously used point", function() {

			const map = [
				[0,0,0],
				[0,1,0],
				[0,0,0]
			]

			const list = [[1,0],[0,0]]

			const point = [0,0]

			const expected = [[0,0],[1,0],[0,0]]

			const actual = path.addAdjacent(map)(list)(point)
			
			assert.deepEqual(actual, expected)
		})

		it("Finds an unavailable point", function() {

			const map = [
				[0,1,0],
				[0,1,0],
				[0,0,0]
			]

			const list = [[0,0]]

			const point = [0,1]

			const expected = []

			const actual = path.addAdjacent(map)(list)(point)
			
			assert.deepEqual(actual, expected)

		})
	})

	describe("removeDuplicates", function() {
		it("Gets rid of those duplicates", function() {

			const list = [[0,1],[0,0],[0,1]]

			const expected = false

			const actual = path.filterDuplicates(list)
			
			assert.equal(actual, expected)
		})

		it("Leaves those non-duplicates", function() {

			const list = [[0,1],[0,0],[0,2]]

			const expected = true

			const actual = path.filterDuplicates(list)

			assert.deepEqual(actual, expected)
		})
	})

	describe("addToThing", function() {
		it("Adds to empty list", function() {
			const list = []

			const point = [1,0]

			const expected = [[1,0]]

			const actual = path.addToList(list, point)

			assert.deepEqual(actual, expected)
		})

		it("Adds to small list", function() {
			const list = [[1,0],[0,0]]

			const point = [1,1]

			const expected = [[1,1],[1,0],[0,0]]

			const actual = path.addToList(list, point)

			assert.deepEqual(actual, expected)
		})
	})

	describe("squaresAround", function() {
		it("Finds them all", function() {
			const point = [0,0]

			const expected = [
				[-1, 0],
				[1, 0],
				[0, -1],
				[0, 1]
			]

			const actual = path.squaresAround(point)

			assert.deepEqual(expected, actual)
		})
	})

	describe("isInList", function() {
		it("Finds one that is", function() {
			const point = [0,0]

			const list = [
				[0,0],
				[1,0]
			]

			const found = path.isInList(list, point)

			assert.equal(found, true)
		})

		it("Finds one that isn't", function() {
			const point = [4,0]

			const list = [
				[0,0],
				[1,0]
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

			const list = [[0,0]]

			const expected = [
				[[1,0],[0,0]]
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

			const list = [[1,0],[0,0]]

			const expected = [
				[[2,0],[1,0],[0,0]]
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

			const list = [[1,0]]

			const expected = [
				[[0,0],[1,0]],
				[[2,0],[1,0]],
			]
				
			const actual = path.getMoveOptions(map)(list)

			assert.deepEqual(actual, expected)

		})
	})

	describe("findAnswerInList", function() {
		it ("Finds one", function() {

			const target = [2,2]

			const list = [
				[[1,2],[3,4]],
				[[2,1],[3,4]],
				[[1,2],[3,4]],
				[[2,2],[3,4]]
			]

			const expected = [[2,2],[3,4]]

			const actual = path.findAnswerInList(target)(list)

			assert.deepEqual(actual, expected)
		})

		it ("Finds nothing", function() {

			const target = [7,9]

			const list = [
				[[1,2],[3,4]],
				[[2,1],[3,4]],
				[[1,2],[3,4]],
				[[2,2],[3,4]]
			]

			const expected = undefined

			const actual = path.findAnswerInList(target)(list)

			assert.deepEqual(actual, expected)
		})
	})

	describe("getMultipleMoveOptions", function() {
		it("Combines two sets of answers correctly", function() {
			const moveOptions = [ 
				[
					[ 
						[1,2], [4,5] 
					],
					[ 
						[7,8], [9,10] 
					] 
				] 
			]

			const expected = [
				[[1,2], [4,5]], [[7,8], [9,10]]
			]

			const actual = path.combineMoveOptions(moveOptions)

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

			const start = [0,0]

			const end = [2,2]

			const expected = false;

			const startList = [[start]]

			const actual = path.processMoveList(map)(startList)(end)

			assert.equal(actual, expected)
		})

		it ("Very quickly wins", function() {
			const map = [
				[0,1],
				[0,1],
			]

			const _processMoveList = path.processMoveList(map)

			const start = [0,0]

			const end = [1,0]

			const expected = [[0,0],[1,0]]

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

			const start = [0,0]

			const end = [2,2]

			const expected = [
				[0,0],
				[1,0],
				[2,0],
				[3,0],
				[3,1],
				[3,2],
				[2,2]
			];

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

			const start = [2,0]

			const end = [0,0]

			const expected = [
				[2,0],
				[2,1],
				[2,2],
				[1,2],
				[0,2],
				[0,1],
				[0,0]
			];

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

			const start = [0,0]

			const end = [11,3]

			const expectedLength = 23

			const startList = [[start]]

			const actual = path.processMoveList(map)(startList)(end)

			assert.equal(actual.length, expectedLength)
		})
	})
	
})