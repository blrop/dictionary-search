const getDict = async () => {
	const response = await fetch('english-dictionary.csv');
	const data = await response.text();
	return data.split('\n');
};

document.addEventListener('DOMContentLoaded', async () => {
	const $input = document.getElementById('input');
	const $status = document.getElementById('status');
	const $result = document.getElementById('result');

	$status.innerText = 'Loading...';

	const dict = await getDict();

	$status.innerText = '';

	$input.addEventListener('input', (e) => {
		$status.innerText = 'Searching...';

		const input = e.target.value.toLowerCase();

		if (!input) {
			$status.innerText = '';
			$result.innerText = '';

			return;
		}

		let foundItem = null;
		let i = 0;
		const startTime = new Date();

		for (let item of dict) {
			i++;
			const word = item.toLowerCase();

			if (word.startsWith(input)) {
				foundItem = item;
				break;
			}
		}

		if (foundItem) {
			const time = (new Date()).getTime() - startTime.getTime();
			$status.innerText = `Found (iterations made: ${i}; time spent: ${time} ms)`;
			$result.innerText = foundItem;
		} else {
			$status.innerText = 'Not found';
			$result.innerText = '';
		}
	});
});
