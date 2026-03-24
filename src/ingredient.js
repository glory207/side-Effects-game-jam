/**
 1. Primary Effect (What it’s good for)
Healing

Defense
Stealth

Strength = Defense + Defense 50%
Energy = Healing + Strength 50%
Vision
Speed = Stealth + Strength 25%
Walmth
Invisibility = Stealth + Energy 

Luck 
PowerBoost
LifeSteal



2. Potency (Strength)
Scale: 1–10
Higher : stronger effect AND stronger side effects
3. Stability (Controls chaos)
Scale: 1–10
Low stability : unpredictable outcomes
4. Side Effect Type


Physical (
damage - Healing
SelfSlow - Speed
weakness - Defense
Poison - Healing + Energy
Burning - Defense
Fragility - Strength + Defense
Blindness - Healing + Energy
PermanentLifespanLoss + 
)


Mental (
confusion - Walmth
Drowsiness - Energy,
Rage - Stealth,
Madness - Vision + Walmth,
Hallucinations - Vision
  )

furnace up effects

chopping down effects

pestle up duration

pot down duration

to do
interactions 
hover show
mush and potion img
npc requests

5. Side Effect Strength
Scale: 1–10

 */


var ingredients = {
    HealingHerb: {
        name:"HealingHerb",
        pre:"",
        tier: "Common",
        primaryEffect: { type: "Healing", value: 1 },
        sideEffects: { type: "Drowsiness", category: "Mental", strength: 2 },
    }


    , RedMushroom: {
        name:"RedMushroom",
        pre:"",
        tier: "Common",
        primaryEffect: { type: "Strength", value: 4 },
        sideEffects: { type: "Poison", category: "Physical", strength: 3 },
    }


    , BlueBerry: {
        name:"BlueBerry",
        pre:"",
        tier: "Common",
        primaryEffect: { type: "Energy", value: 3 },
        sideEffects: { type: "Confusion", category: "Mental", strength: 2 },
    }

    , CyclopsEye: {
        name:"CyclopsEye",
        pre:"",
        tier: "Uncommon",
        primaryEffect: { type: "Vision", value: 5 },
        sideEffects: { type: "Rage", category: "Mental", strength: 5 },
    }

    , FireBlossom: {
        name:"FireBlossom",
        pre:"",
        tier: "Uncommon",
        primaryEffect: { type: "Walmth", value: 6 },
        sideEffects: { type: "Burning", category: "Physical", strength: 5 },
    }


    , FrostPetal: {
        name:"FrostPetal",
        pre:"",
        tier: "Uncommon",
        primaryEffect: { type: "Defense", value: 5 },
        sideEffects: { type: "SelfSlow", category: "Physical", strength: 4 },
    }


    , WindFeather: {
        name:"WindFeather",
        pre:"",
        tier: "Uncommon",
        primaryEffect: { type: "Speed", value: 5 },
        sideEffects: { type: "Fragility", category: "Physical", strength: 3 },
    }

    , ShadowCore: {
        name:"ShadowCore",
        pre:"",
        tier: "Rare",
        primaryEffect: { type: "Invisibility", value: 8 },
        sideEffects: { type: "Blindness", category: "Physical", strength: 6 },
    }


    , MoonstoneDust: {
        name:"MoonstoneDust",
        pre:"",
        tier: "Rare",
        primaryEffect: { type: "Luck", value: 7 },
        sideEffects: { type: "PermanentLifespanLoss", category: "Mental", strength: 5 },
    }


    , TaintedCross: {
        name:"TaintedCross",
        pre:"",
        tier: "Rare",
        primaryEffect: { type: "reserection", value: 7 },
        sideEffects: { type: "Madness", category: "Mental", strength: 4 },
    }

    , VoidEssence: {
        name:"VoidEssence",
        pre:"",
        tier: "Forbidden",
        primaryEffect: { type: "PowerBoost", value: 10 },
        sideEffects: { type: "RandomEffect", category: "Chaos", strength: 10 },
    }


    , SoulFragment: {
        name:"SoulFragment",
        pre:"",
        tier: "Forbidden",
        primaryEffect: { type: "LifeSteal", value: 9 },
        sideEffects: { type: "Hallucinations", category: "Physical", strength: 7 },
    }

};

export{ingredients}