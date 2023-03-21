/**
 * This file is meant to assist the server in computing outcomes of the game
 * it's essentially the javascript mirror of the circuit turn.circom
 * logic
 */

const model = require('./model.js');

const calculateMoveEffectiveness = (target, move) => {
    if (move.category === 0 || move.type === model.MoveTypes.SWAP) {
        return {
            atkEff: 1,
            defEff: 1,
        }
    }

    const atkEff = model.EffectivenessMatrix[move.category - 1][target.category - 1];
    const defEff = model.EffectivenessMatrix[target.category - 1][move.category - 1];

    return {
        atkEff,
        defEff
    }
}

const calculateCrit = (source, move, randomness) => {
    return (randomness < move.crit) ? (
        0
    ) : (
        source.stats.attack * 2
    );
}

const isMiss = (move, randomness) => {
    return randomness <= move.miss
}


class Engine {
    constructor(playerId, npcId, moveLimit) {
        this.player = {
            ...model.Monsters[playerId - 1],
        };
        this.npc = {
            ...model.Monsters[npcId - 1],
        };
        this.moveLimit = moveLimit
        this.previousMoves = [];
        this.previousState = [];
        this.prevAtkEff = [];
        this.prevDefEff = [];
        this.prevRandomness = [];
        this.isPlayerMove = true;
    }

    snapshotTurn = (move, randomness, atkEff, defEff) => {
        this.previousState.push({
            player: { 
                ...this.player, 
            },
            npc: {
                ...this.npc,
            }
        });
        this.previousMoves.push(move);
        this.prevAtkEff.push(atkEff);
        this.prevDefEff.push(defEff);
        this.prevRandomness.push(randomness);
    }

    get source() {
        return this.isPlayerMove ? this.player : this.npc;
    }

    get target() {
        return this.isPlayerMove ? this.npc : this.player;
    }


    turn(move, randomness) {
        // the player always starts first
        this.isPlayerMove = !(this.previousMoves.length % 2);

        const { atkEff, defEff } = calculateMoveEffectiveness(this.target, move);

        if (move.type === model.MoveTypes.END_GAME) {
            if (this.previousMoves.length === this.moveLimit - 1) {
                throw new Error("Move limit has been reached, no additional turns allowed");
            }
            this.snapshotTurn(move, randomness, atkEff, defEff);
            return;
        }

        if (move.type !== model.MoveTypes.SWAP && move.category !== 0 && move.category !== this.source.category) {
            throw new Error("This is an illegal move for the character type")
        }

        this.snapshotTurn(move, randomness, atkEff, defEff);
        if (isMiss(move, randomness)) {

            //move failed
            return {
                isMiss: true,
            };
        }
        var report = {
            isMiss: isMiss(move, randomness),
        }
        switch (move.type) {
            case model.MoveTypes.SWAP: {
                report = {
                    ...report,
                    ...this.swap(move)
                }
                break;
            }
            case  model.MoveTypes.HEAL: {
                report = {
                    ...report,
                    ...this.heal(move)
                }
                break;
            }
            case model.MoveTypes.ATTACK: {
                report = {
                    ...report,
                    ...this.damage(move, randomness, atkEff, defEff),
                }
                break;
            }
            default: {
                throw new Error("Unknown move type: ", move.type);
            }
        }

        return report;
    }

    swap(move) {
        if (this.isPlayerMove) {
            this.player = {
                ...this.player,
                stats: {
                    ...model.Monsters[move.category - 1].stats
                },
                category: move.category
            }
            return {
                swapped: move.category,
            }
        } else {
            this.npc = {
                ...this.npc,
                stats: {
                    ...model.Monsters[move.category - 1].stats
                },
                category: move.category
            }
            return {
                swapped: move.category,
            }
        }
    }

    heal(move) {
        if (this.isPlayerMove) {
            this.player = {
                ...this.player,
                hp: Math.min(this.player.hp + move.attack, 100), 
            }
            return {
                healed: move.attack
            }
        } else {
            this.npc = {
                ...this.npc,
                hp: Math.min(this.npc.hp + move.attack, 100), 
            }
            return {
                healed: move.attack
            }
        }
    }

    damage(move, randomness, atkEff, defEff) {
        const critMod = calculateCrit(this.source, move, randomness);
        const resistance = defEff === 0 ? 2 : this.target.stats.defense; 
        const power = atkEff === 0 ? 2 : move.attack * atkEff;
        const dmg = (critMod + power) < resistance ? resistance : critMod + power; //this protects against weird logic below where resistance will add to the health


        if (this.isPlayerMove) {
            this.npc = {
                ...this.npc,
                hp: Math.min(Math.max(0, this.npc.hp - dmg + resistance), 100),
            }
            return {
                dmg,
                critMod
            }
        } else {
            this.player = {
                ...this.player,
                hp: Math.min(Math.max(0, this.player.hp - dmg + resistance), 100),
            }
            return {
                dmg,
                critMod
            }
        }
    }
}


module.exports = Engine;
