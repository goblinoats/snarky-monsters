// this file holds the model in a convenient JS format and comes with a convenient serialization function

//This structure mostly for record keeping
const Category = {
    UNIVERSAL: 0,
    DEGEN: 1,
    REGULATOR: 2,
    VC: 3, 
    NORMIE: 4,
    AGI: 5,
    BITCOIN_MAXI: 6,
    MOON_MATHER: 7,
}

const MoveTypes = {
    SWAP: 0,
    HEAL: 1,
    ATTACK: 2,
    BUFF: 3,
    NERF: 4,
}

const Moves = [{
    id: 0,
    attack: 0,
    crit: 0,
    miss: 20,
    category: Category.UNIVERSAL,
    type: MoveTypes.SWAP
}, {
    id: 1,
    attack: 10,
    crit: 2,
    miss: 10,
    category: Category.UNIVERSAL,
    type: MoveTypes.HEAL
}, {
    id: 2,
    attack: 10,
    crit: 2,
    miss: 10,
    category: Category.UNIVERSAL,
    type: MoveTypes.ATTACK
}, {
    id: 3,
    attack: 10,
    crit: 2,
    miss: 10,
    category: Category.DEGEN,
    type: MoveTypes.ATTACK
}, {
    id: 4,
    attack: 10,
    crit: 2,
    miss: 10,
    category: Category.DEGEN,
    type: MoveTypes.ATTACK
}, {
    id: 5,
    attack: 10,
    crit: 2,
    miss: 10,
    category: Category.REGULATOR,
    type: MoveTypes.ATTACK
}, {
    id: 6,
    attack: 10,
    crit: 2,
    miss: 10,
    category: Category.REGULATOR,
    type: MoveTypes.ATTACK
}, {
    id: 7,
    attack: 10,
    crit: 2,
    miss: 10,
    category: Category.VC,
    type: MoveTypes.ATTACK
}, {
    id: 8,
    attack: 10,
    crit: 2,
    miss: 10,
    category: Category.VC,
    type: MoveTypes.ATTACK
}, {
    id: 9,
    attack: 10,
    crit: 2,
    miss: 10,
    category: Category.NORMIE,
    type: MoveTypes.ATTACK
}, {
    id: 10,
    attack: 10,
    crit: 2,
    miss: 10,
    category: Category.NORMIE,
    type: MoveTypes.ATTACK
}, {
    id: 11,
    attack: 10,
    crit: 2,
    miss: 10,
    category: Category.AGI,
    type: MoveTypes.ATTACK
}, {
    id: 12,
    attack: 10,
    crit: 2,
    miss: 10,
    category: Category.AGI,
    type: MoveTypes.ATTACK
}, {
    id: 13,
    attack: 10,
    crit: 2,
    miss: 10,
    category: Category.BITCOIN_MAXI,
    type: MoveTypes.ATTACK
}, {
    id: 14,
    attack: 10,
    crit: 2,
    miss: 10,
    category: Category.BITCOIN_MAXI,
    type: MoveTypes.ATTACK
}, {
    id: 15,
    attack: 10,
    crit: 2,
    miss: 10,
    category: Category.MOON_MATHER,
    type: MoveTypes.ATTACK
}, {
    id: 16,
    attack: 10,
    crit: 2,
    miss: 10,
    category: Category.MOON_MATHER,
    type: MoveTypes.ATTACK
}];

const Monsters = [{
    id: 0,
    hp: 100,
    stats: {
        attack: 10,
        defense: 10,
    },
    category: Category.DEGEN,
}, {
    id: 1,
    hp: 100,
    stats: {
        attack: 10,
        defense: 10,
    },
    category: Category.REGULATOR,
}, {
    id: 2,
    hp: 100,
    stats: {
        attack: 10,
        defense: 10,
    },
    category: Category.VC,
}, {
    id: 3,
    hp: 100,
    stats: {
        attack: 10,
        defense: 10,
    },
    category: Category.NORMIE,
}, {
    id: 4,
    hp: 100,
    stats: {
        attack: 10,
        defense: 10,
    },
    category: Category.AGI,
}, {
    id: 5,
    hp: 100,
    stats: {
        attack: 10,
        defense: 10,
    },
    category: Category.BITCOIN_MAXI,
}, {
    id: 6,
    hp: 100,
    stats: {
        attack: 10,
        defense: 10,
    },
    category: Category.MOON_MATHER,
}];

const Game = {
    Monsters: Monsters,
    Moves: Moves,
}


// this is a utility script to serialize the state models for input into the circuits
const { writeFile } = require('node:fs/promises');
const path = require('node:path');


// Get the command line arguments
// input_path is to a json file of the game model, output_path writes the json input ready for the circom file
// expected input is ./model [output_path]
const args = process.argv.slice(2);

// Check if any arguments were provided
if (args.length === 0) {
  console.log('Please provide some input!');
  process.exit(1);
}


try {
    const argOutput = args[0];
    const outputPath = path.join(process.cwd(), argOutput);
    console.log(outputPath);

    console.log(JSON.stringify(Game));

    writeFile(outputPath, JSON.stringify(Game), { encoding: 'utf8' });
} catch (e) {
    console.log(e);
}


