module.exports =  function(connectedUsers){
	const NAMES = [
		'Beat PunchBeef',
		'Big, Brave Brick of Meat',
		'Big McLargeHuge',
		'Blast HardCheese',
		'Blast ThickNeck',
		'Bob Johnson',
		'Bold BigFlank',
		'Bolt VanderHuge',
		'Brick HardMeat',
		'Buck PlankChest',
		'Buff DrinkLots',
		'Buff HardBack',
		'Butch DeadLift',
		'Crud BoneMeal',
		'Crunch ButtSteak',
		'Dirk HardPec',
		'Fist RockBone',
		'Flint IronStag',
		'Fridge LargeMeat',
		'Gristle McThornBody',
		'Hack BlowFist',
		'Lump BeefBroth',
		'Punch RockGroin',
		'Punch Side-Iron',
		'Punt SpeedChunk',
		'Reef BlastBody',
		'Roll Fizzlebeef',
		'Rip SteakFace',
		'Slab BulkHead',
		'Slab SquatThrust',
		'Slate Fistcrunch',
		'Slate SlabRock',
		'Smash LampJaw',
		'Smoke ManMuscle',
		'Splint ChestHair',
		'Stump BeefKnob',
		'Stump Chunkman',
		'Thick McRunFast',
		'Touch RustRod',
		'Trunk SlamChest',
		'Whip SlagCheek'
	];

	let name;

	do{
		name = NAMES[Math.floor(Math.random() * NAMES.length)];
	}while(connectedUsers.indexOf(name) !== -1 );

	return name;
};