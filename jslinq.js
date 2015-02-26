function Linq(array) {
	if (this.constructor !== Linq)
		return new Linq(array);

	var self = this;

	if (array === null || typeof array === 'undefined')
		throw new TypeError('"array" is null or undefined');

	if (typeof array.length !== 'number')
		throw new TypeError('"array" is not an array or an array like object');

	array = [].slice.call(array); // ensure we are dealing with a real array;

	this.forEach = function(callback, thisvalue) {
		array.forEach(callback, thisvalue);
	};

	this.select = function(callback) {
		return new Linq(array.map(callback));
	};

	this.where = function(callback) {
		return new Linq(array.filter(callback));
	};

	this.skip = function(num) {
		return new Linq(array.slice(num));
	};

	this.take = function(num) {
		return new Linq(array.slice(0, num));
	};

	this.orderBy = function(callback) {
		return new Linq(array.sort(function(item1, item2) {
			var a = callback(item1),
				b = callback(item2);
			if (typeof a === 'string')
				return a.localeCompare(b);
			return a - b;
		}));
	};

	this.orderByDecsending = function(callback) {
		return new Linq(array.sort(function(item1, item2) {
			var a = callback(item2),
				b = callback(item1);
			if (typeof a === 'string')
				return a.localeCompare(b);
			return a - b;
		}));
	};

	this.distinct = function(callback) {
		function onlyUnique(item, index, arr) {
			return arr.indexOf(item) === index;
		}

		if (typeof callback === 'function') {
			return new Linq(array.map(callback).filter(onlyUnique));
		}

		return new Linq(array.filter(onlyUnique));
	};

	this.groupBy = function(keyCallback, valueCallback) {
		if (typeof keyCallback !== 'function')
			throw new TypeError('groupby called without a keyCallback function');
		var groups = [];
		array.forEach(function(item) {
			var key = keyCallback(item),
				value = typeof valueCallback === 'function' ? valueCallback(item) : item,
				group = groups.filter(function(gr) {
					return gr.Key === key;
				})[0];

			if (group === null || typeof group === 'undefined') {
				groups.push({
					Key: key,
					Value: new Linq([value])
				});
			} else {
				group.Value.add(value);
			}
		});
		var result = new Linq(groups);
		result.get = function(Key) {
			return this.where(function(item) {
				return item.Key === Key;
			}).firstOrDefault();
		};
		return result;
	};

	this.add = function(item) {
		array.push(item);
		return this;
	};

	this.count = function() {
		return array.length;
	};

	this.first = function() {
		if (array.length) return array[0];
	};

	this.firstOrDefault = function() {
		return self.first() || null;
	};

	this.toArray = function() {
		return array;
	};

	this.intersect = function(arr) {

	};

	this.max = function(callback) {
		var max = typeof callback === 'function' ? callback(array[0]) : array[0];
		array.forEach(function(item) {
			var temp = typeof callback === 'function' ? callback(item) : item;
			if (max < temp) max = temp;
		});
		return max;
	};

	this.min = function(callback) {
		var min = typeof callback === 'function' ? callback(array[0]) : array[0];
		array.forEach(function(item) {
			var temp = typeof callback === 'function' ? callback(item) : item;
			if (min > temp) min = temp;
		});
		return min;
	};

	function deepEqual(a, b) {
		if (a === b) return true;
		var equal = false;
		for (var k in a) {
			if (a.hasOwnProperty(k) && b.hasOwnProperty(k)) {
				equal = deepEqual(a[k], b[k]);
			} else {
				equal = false;
			}
		}
		return equal;
	}
}

var b = Linq([{
	id: 1,
	name: 'test 1',
	type: 1
}, {
	id: 2,
	name: 'test 2',
	type: 1
}, {
	id: 3,
	name: 'test 3',
	type: 1
}, {
	id: 4,
	name: 'test 4',
	type: 1
}, {
	id: 5,
	name: 'test 5',
	type: 2
}, {
	id: 6,
	name: 'test 6',
	type: 2
}, {
	id: 7,
	name: 'test 7',
	type: 2
}]);


console.log(
	b.min(function(item) {
		return item.type;
	})
);