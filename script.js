const getDict = async () => {
	const response = await fetch('english-dictionary.csv');
	const data = await response.text();
	return data.split('\n');
};

const findViaSimpleIteration = (dict, input) => {
	let foundItem = null;
	let i = 0;

	for (let item of dict) {
		i++;
		const word = item.toLowerCase();

		if (word.startsWith(input)) {
			foundItem = item;
			break;
		}
	}

	return {
		foundItem,
		iterationsCount: i,
	};
};

const findViaBinarySearch = (dict, input) => {
	let iterationsCount = 0;

	const findBetween = (start, end) => {
		iterationsCount++;

		const middleIndex = start + Math.floor((end - start) / 2);
		if (middleIndex === start) {
			if (dict[start].toLowerCase().startsWith(input)) {
				return dict[start];
			} else if (dict[end].toLowerCase().startsWith(input)) {
				return dict[end];
			} else {
				return null;
			}
		}

		const middleWord = dict[middleIndex].toLowerCase();
		if (input <= middleWord) {
			return findBetween(start, middleIndex);
		} else {
			return findBetween(middleIndex + 1, end);
		}
	};

	return {
		foundItem: findBetween(0, dict.length - 1),
		iterationsCount,
	};
};

document.addEventListener('DOMContentLoaded', async () => {
	const $input = document.getElementById('text-input');
	const $searchTypeIteration = document.getElementById('search-type-iteration');
	const $searchTypeBinary = document.getElementById('search-type-binary');
	const $status = document.getElementById('status');
	const $result = document.getElementById('result');

	let useBinarySearch = $searchTypeBinary.checked;

	$status.innerText = 'Loading...';

	const dict = await getDict();

	$input.disabled = false;
	$input.focus();
	$status.innerText = '';

	$input.addEventListener('input', (e) => {
		$status.innerText = 'Searching...';

		const input = e.target.value.toLowerCase();

		if (!input) {
			$status.innerText = '';
			$result.innerText = '';

			return;
		}

		const startTime = performance.now();
		let result;

		if (useBinarySearch) {
			result = findViaBinarySearch(dict, input);
		} else {
			result = findViaSimpleIteration(dict, input);
		}
		const foundItem = result.foundItem;
		const iterationsCount = result.iterationsCount;

		if (foundItem) {
			const time = (performance.now() - startTime).toFixed(1);
			$status.innerText = `Found (iterations made: ${iterationsCount}; time spent: ${time} ms)`;
			$result.innerText = foundItem;
		} else {
			$status.innerText = 'Not found';
			$result.innerText = '';
		}
	});

	const onSearchTypeChange = () => {
		useBinarySearch = $searchTypeBinary.checked;
	};

	$searchTypeIteration.addEventListener('change', onSearchTypeChange);
	$searchTypeBinary.addEventListener('change', onSearchTypeChange);
});
