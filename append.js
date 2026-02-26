const fs = require('fs');

const file = 'pokemon-data.js';
let content = fs.readFileSync(file, 'utf8');

// The new pokemon strings
const newPokemons = `    { id: 'chienpao', name: 'パオジアン', types: ['あく', 'こおり'], bs: [80, 120, 80, 90, 65, 135], abilities: ['わざわいのつるぎ'], defaultAbility: 'わざわいのつるぎ' },
    { id: 'chiyu', name: 'イーユイ', types: ['あく', 'ほのお'], bs: [55, 80, 80, 135, 120, 100], abilities: ['わざわいのたま'], defaultAbility: 'わざわいのたま' },
    { id: 'tinglu', name: 'ディンルー', types: ['あく', 'じめん'], bs: [155, 110, 125, 55, 80, 45], abilities: ['わざわいのうつわ'], defaultAbility: 'わざわいのうつわ' },
    { id: 'wochien', name: 'チオンジェン', types: ['あく', 'くさ'], bs: [85, 85, 100, 95, 135, 70], abilities: ['わざわいのおふだ'], defaultAbility: 'わざわいのおふだ' },
`;

// Remove Pecharunt
content = content.replace(/.*pecharunt.*?\n/gi, '');

// Insert before the last line (\`];\`)
const insertIndex = content.lastIndexOf('];');
if (insertIndex !== -1) {
    content = content.slice(0, insertIndex) + newPokemons + content.slice(insertIndex);
    fs.writeFileSync(file, content, 'utf8');
    console.log("Successfully patched POKEMON data!");
} else {
    console.error("Could not find array end ];");
}
