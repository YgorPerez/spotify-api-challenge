const formatMilliseconds = ({
	milliseconds,
	padStart = true,
}: {
	milliseconds: number;
	padStart?: boolean;
}) => {
	function pad(num: number) {
		return `${num}`.padStart(2, "0");
	}
	let asSeconds = milliseconds / 1000;

	let hours = undefined;
	let minutes = Math.floor(asSeconds / 60);
	let seconds = Math.floor(asSeconds % 60);

	if (minutes > 59) {
		hours = Math.floor(minutes / 60);
		minutes %= 60;
	}

	return hours
		? `${padStart ? pad(hours) : hours}:${pad(minutes)}:${pad(seconds)}`
		: `${padStart ? pad(minutes) : minutes}:${pad(seconds)}`;
};

export default formatMilliseconds;
