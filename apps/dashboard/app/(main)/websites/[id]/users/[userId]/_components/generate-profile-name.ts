// Generate cute consistent profile names based on visitor ID
const prefixes = [
	'Captain',
	'Admiral',
	'Professor',
	'Doctor',
	'Lady',
	'Lord',
	'Sir',
	'Master',
	'Chief',
	'Commander',
	'Baron',
	'Duke',
	'Duchess',
	'Earl',
	'Marquis',
	'Princess',
	'Prince',
	'King',
	'Queen',
	'Emperor',
	'Empress',
	'Wizard',
	'Sage',
	'Mystic',
	'Shaman',
	'Guardian',
	'Champion',
	'Hero',
	'Explorer',
	'Warrior',
];

const adjectives = [
	'Brave',
	'Clever',
	'Daring',
	'Elegant',
	'Gentle',
	'Honorable',
	'Jolly',
	'Kind',
	'Lucky',
	'Magnificent',
	'Noble',
	'Optimistic',
	'Peaceful',
	'Quick',
	'Radiant',
	'Swift',
	'Tenacious',
	'Valiant',
	'Wise',
	'Zealous',
	'Brilliant',
	'Cunning',
	'Dazzling',
	'Epic',
	'Fierce',
	'Gallant',
	'Humble',
	'Inspired',
	'Jubilant',
	'Mighty',
];

const nouns = [
	'Adventurer',
	'Bard',
	'Crusader',
	'Dragon',
	'Enchanter',
	'Falcon',
	'Gryphon',
	'Hawk',
	'Illusionist',
	'Jester',
	'Knight',
	'Lion',
	'Magician',
	'Ninja',
	'Oracle',
	'Phoenix',
	'Questmaster',
	'Ranger',
	'Sage',
	'Tiger',
	'Unicorn',
	'Vanguard',
	'Wolf',
	'Xenomorph',
	'Yogi',
	'Zealot',
	'Architect',
	'Champion',
	'Deadeye',
	'Elder',
];

// Simple hash function to convert string to number
function hashString(str: string): number {
	let hash = 0;
	for (let i = 0; i < str.length; i++) {
		const char = str.charCodeAt(i);
		hash = (hash << 5) - hash + char;
		hash = hash & hash; // Convert to 32bit integer
	}
	return Math.abs(hash);
}

export function generateProfileName(visitorId: string): string {
	const hash = hashString(visitorId);
	const prefixIndex = hash % prefixes.length;
	const adjIndex = Math.floor(hash / prefixes.length) % adjectives.length;
	const nounIndex =
		Math.floor(hash / (prefixes.length * adjectives.length)) % nouns.length;
	return `${prefixes[prefixIndex]} ${adjectives[adjIndex]} ${nouns[nounIndex]}`;
}

