var fs = require('fs');

var items = JSON.parse(fs.readFileSync('items.json'));
var unpurchasable = [1060,1062,1063,3180,3181,3182,3184,3185,3186,3187,2047,1061,
  2048,3122,3090,3104,3188,3084,3159,2040,3132,2051,3073,3007,3008,3029,3112,3170,
  3043,3048,3290,1074,1075,1076,3137,3417,3418,3419,3420,3421,3422,3345,3450,3451,
  3452,3453,3454,3204,3208,2037,2039,3206,3207,3209,3106,3154,3160,3205,1080,3460,
  3123,3131,3005,3128,3166,3405,3411,3286];

var selected = [
1011, // 1000 Giant's Belt
1018, // 730 Cloak of Agility
1026, // 860 Blasting Wand
1027, // 400 Sapphire Crystal
1028, // 400 Ruby Crystal
1029, // 300 Cloth Armor
1031, // 750 Chain Vest
1033, // 500 Null-Magic Mantle
1036, // 360 Long Sword
1037, // 875 Pickaxe
1038, // 1550 B. F. Sword
1039, // 400 Hunter's Machete
1042, // 450 Dagger
1043, // 900 Recurve Bow
1051, // 400 Brawler's Gloves
1052, // 435 Amplifying Tome
1053, // 800 Vampiric Scepter
1054, // 440 Doran's Shield
1055, // 440 Doran's Blade
1056, // 400 Doran's Ring
1057, // 850 Negatron Cloak
1058, // 1600 Needlessly Large Rod
2045, // 1600 Ruby Sightstone
2049, // 800 Sightstone
2053, // 1000 Raptor Cloak
3001, // 2440 Abyssal Scepter
3003, // 2700 Archangel's Staff
3004, // 2200 Manamune
3006, // 1000 Berserker's Greaves
3009, // 1000 Boots of Swiftness
3010, // 1200 Catalyst the Protector
3020, // 1100 Sorcerer's Shoes
3022, // 3300 Frozen Mallet
3023, // 2400 Twin Shadows
3024, // 950 Glacial Shroud
3025, // 2900 Iceborn Gauntlet
3026, // 2800 Guardian Angel
3027, // 2800 Rod of Ages
3028, // 900 Chalice of Harmony
3031, // 3800 Infinity Edge
3035, // 2300 Last Whisper
3040, // 2700 Seraph's Embrace
3042, // 2200 Muramana
3044, // 1325 Phage
3046, // 2800 Phantom Dancer
3047, // 1000 Ninja Tabi
3050, // 2450 Zeke's Herald
3056, // 2600 Ohmwrecker
3057, // 1200 Sheen
3060, // 3000 Banner of Command
3065, // 2750 Spirit Visage
3067, // 850 Kindlegem
3068, // 2600 Sunfire Cape
3069, // 2100 Talisman of Ascension
3070, // 720 Tear of the Goddess
3071, // 3000 The Black Cleaver
3072, // 3500 The Bloodthirster
3074, // 3300 Ravenous Hydra (Melee Only)
3075, // 2100 Thornmail
3077, // 1900 Tiamat (Melee Only)
3078, // 3703 Trinity Force
3082, // 1050 Warden's Mail
3083, // 2500 Warmog's Armor
3085, // 2400 Runaan's Hurricane (Ranged Onl
3086, // 1100 Zeal
3087, // 2500 Statikk Shiv
3089, // 3300 Rabadon's Deathcap
3091, // 2600 Wit's End
3092, // 2200 Frost Queen's Claim
3093, // 800 Avarice Blade
3096, // 865 Nomad's Medallion
3097, // 865 Targon's Brace
3098, // 865 Frostfang
3100, // 3000 Lich Bane
3101, // 1250 Stinger
3102, // 2750 Banshee's Veil
3105, // 1900 Aegis of the Legion
3108, // 820 Fiendish Codex
3110, // 2450 Frozen Heart
3111, // 1200 Mercury's Treads
3113, // 850 Aether Wisp
3114, // 600 Forbidden Idol
3115, // 2920 Nashor's Tooth
3116, // 2900 Rylai's Crystal Scepter
3117, // 800 Boots of Mobility
3124, // 2600 Guinsoo's Rageblade
3134, // 1337 The Brutalizer
3135, // 2295 Void Staff
3136, // 1485 Haunting Guise
3139, // 3700 Mercurial Scimitar
3140, // 1250 Quicksilver Sash
3142, // 2700 Youmuu's Ghostblade
3143, // 2850 Randuin's Omen
3144, // 1400 Bilgewater Cutlass
3145, // 1200 Hextech Revolver
3146, // 3400 Hextech Gunblade
3151, // 2900 Liandry's Torment
3152, // 2500 Will of the Ancients
3153, // 3200 Blade of the Ruined King
3155, // 1450 Hexdrinker
3156, // 3200 Maw of Malmortius
3157, // 3300 Zhonya's Hourglass
//3158, // 1000 Ionian Boots of Lucidity
3165, // 2300 Morellonomicon
3172, // 2850 Zephyr
3174, // 2700 Athene's Unholy Grail
3190, // 2800 Locket of the Iron Solari
3191, // 1200 Seeker's Armguard
3211, // 1200 Spectre's Cowl
3222, // 2450 Mikael's Crucible
3250, // 1475 Enchantment: Homeguard
3251, // 1600 Enchantment: Captain
3252, // 1475 Enchantment: Furor
3253, // 1475 Enchantment: Distortion
3254, // 1475 Enchantment: Alacrity
3255, // 1575 Enchantment: Homeguard
3256, // 1700 Enchantment: Captain
3257, // 1575 Enchantment: Furor
3258, // 1575 Enchantment: Distortion
3259, // 1575 Enchantment: Alacrity
3260, // 1475 Enchantment: Homeguard
3261, // 1600 Enchantment: Captain
3262, // 1475 Enchantment: Furor
3263, // 1475 Enchantment: Distortion
3264, // 1475 Enchantment: Alacrity
3265, // 1675 Enchantment: Homeguard
3266, // 1800 Enchantment: Captain
3267, // 1675 Enchantment: Furor
3268, // 1675 Enchantment: Distortion
3269, // 1675 Enchantment: Alacrity
3270, // 1275 Enchantment: Homeguard
3271, // 1400 Enchantment: Captain
3272, // 1275 Enchantment: Furor
3273, // 1275 Enchantment: Distortion
3274, // 1275 Enchantment: Alacrity
//3275, // 1475 Enchantment: Homeguard
//3276, // 1600 Enchantment: Captain
//3277, // 1475 Enchantment: Furor
//3278, // 1475 Enchantment: Distortion
//3279, // 1475 Enchantment: Alacrity
3280, // 1475 Enchantment: Homeguard
3281, // 1600 Enchantment: Captain
3282, // 1475 Enchantment: Furor
3283, // 1475 Enchantment: Distortion
3284, // 1475 Enchantment: Alacrity
3285, // 3100 Luden's Echo
3401, // 2200 Face of the Mountain
3504, // 2100 Ardent Censer
3508, // 3200 Essence Reaver
3512, // 2800 Zz'Rot Portal
3706, // 850 Stalker's Blade
3707, // 2250 Enchantment: Warrior
3708, // 2250 Enchantment: Magus
3709, // 2250 Enchantment: Cinderhulk
3710, // 2250 Enchantment: Devourer
3711, // 850 Poacher's Knife
3713, // 850 Ranger's Trailblazer
3714, // 2250 Enchantment: Warrior
3715, // 850 Skirmisher's Sabre
3716, // 2250 Enchantment: Magus
3717, // 2250 Enchantment: Cinderhulk
3718, // 2250 Enchantment: Devourer
3719, // 2250 Enchantment: Warrior
3720, // 2250 Enchantment: Magus
3721, // 2250 Enchantment: Cinderhulk
3722, // 2250 Enchantment: Devourer
3723, // 2250 Enchantment: Warrior
3724, // 2250 Enchantment: Magus
3725, // 2250 Enchantment: Cinderhulk
3726, // 2250 Enchantment: Devourer
3800  // 2500 Righteous Glory
];

var mapto = {
'3250' : 3006, // 1475 Enchantment: Homeguard
'3251' : 3006, // 1600 Enchantment: Captain
'3252' : 3006, // 1475 Enchantment: Furor
'3253' : 3006, // 1475 Enchantment: Distortion
'3254' : 3006, // 1475 Enchantment: Alacrity
'3255' : 3020, // 1575 Enchantment: Homeguard
'3256' : 3020, // 1700 Enchantment: Captain
'3257' : 3020, // 1575 Enchantment: Furor
'3258' : 3020, // 1575 Enchantment: Distortion
'3259' : 3020, // 1575 Enchantment: Alacrity
'3260' : 3047, // 1475 Enchantment: Homeguard
'3261' : 3047, // 1600 Enchantment: Captain
'3262' : 3047, // 1475 Enchantment: Furor
'3263' : 3047, // 1475 Enchantment: Distortion
'3264' : 3047, // 1475 Enchantment: Alacrity
'3265' : 3111, // 1675 Enchantment: Homeguard
'3266' : 3111, // 1800 Enchantment: Captain
'3267' : 3111, // 1675 Enchantment: Furor
'3268' : 3111, // 1675 Enchantment: Distortion
'3269' : 3111, // 1675 Enchantment: Alacrity
'3270' : 3117, // 1275 Enchantment: Homeguard
'3271' : 3117, // 1400 Enchantment: Captain
'3272' : 3117, // 1275 Enchantment: Furor
'3273' : 3117, // 1275 Enchantment: Distortion
'3274' : 3117, // 1275 Enchantment: Alacrity
//'3275' : 3158, // 1475 Enchantment: Homeguard
//'3276' : 3158, // 1600 Enchantment: Captain
//'3277' : 3158, // 1475 Enchantment: Furor
//'3278' : 3158, // 1475 Enchantment: Distortion
//'3279' : 3158, // 1475 Enchantment: Alacrity
'3280' : 3009, // 1475 Enchantment: Homeguard
'3281' : 3009, // 1600 Enchantment: Captain
'3282' : 3009, // 1475 Enchantment: Furor
'3283' : 3009, // 1475 Enchantment: Distortion
'3284' : 3009, // 1475 Enchantment: Alacrity
//'3707' : 3707, // 2250 Enchantment: Warrior
//'3708' : 3708, // 2250 Enchantment: Magus
//'3709' : 3709, // 2250 Enchantment: Cinderhulk
//'3710' : 3710, // 2250 Enchantment: Devourer
'3714' : 3707, // 2250 Enchantment: Warrior
'3716' : 3708, // 2250 Enchantment: Magus
'3717' : 3709, // 2250 Enchantment: Cinderhulk
'3718' : 3710, // 2250 Enchantment: Devourer
'3719' : 3707, // 2250 Enchantment: Warrior
'3720' : 3708, // 2250 Enchantment: Magus
'3721' : 3709, // 2250 Enchantment: Cinderhulk
'3722' : 3710, // 2250 Enchantment: Devourer
'3723' : 3707, // 2250 Enchantment: Warrior
'3724' : 3708, // 2250 Enchantment: Magus
'3725' : 3709, // 2250 Enchantment: Cinderhulk
'3726' : 3710, // 2250 Enchantment: Devourer
'3706' : 1039, // 850 Stalker's Blade
'3711' : 1039, // 850 Poacher's Knife
'3713' : 1039, // 850 Ranger's Trailblazer
'3715' : 1039, // 850 Skirmisher's Sabre
}
var selectedData = {};
for (var itemid in items.data) {
  if (unpurchasable.indexOf(parseInt(itemid)) >= 0) {
    continue;
  }
  //console.log(itemid + ', // ' + item.gold.total + ' ' + item.name);

  if (selected.indexOf(parseInt(itemid)) >= 0) {
    var item = items.data[itemid];
    var item2 = {};
    item2.name = item.name;
    item2.gold = item.gold.total;
    if (mapto[itemid]) {
      item2.mapto = mapto[itemid];
    }
    selectedData[itemid] = item2;
  }
}

fs.writeFileSync('items_filtered.json', JSON.stringify(selectedData));
