// src/utils/pokeLogic.js

// 1. Get a random ID (Gen 1 only: 1-151)
const getRandomId = () => Math.floor(Math.random() * 1000) + 1;

export  const fetchQuizData = async () => {
    // 2. Generate 4 unique random IDs
    const ids = new Set();
    while (ids.size < 4) {
        ids.add(getRandomId());
    }
    const idArray = [...ids];

    // 3. Pick one random ID from the 4 to be the "Correct Answer"
    const correctIndex = Math.floor(Math.random() * 4);
    const correctId = idArray[correctIndex];

    // 4. Fetch data for ALL 4 Pokemon in parallel
    // We use Promise.all because it's much faster than fetching one by one
    const promises = idArray.map(id => 
        fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then(res => res.json())
    );

    const results = await Promise.all(promises);

    // 5. Format the data for our game
    const options = results.map(pokemon => ({
        id: pokemon.id,
        name: pokemon.name,
        // Used for the button labels
    }));

    const correctPokemon = results[correctIndex];

    return {
        options, // Array of 4 pokemon objects
        correctOption: {
            id: correctPokemon.id,
            name: correctPokemon.name,
            image: correctPokemon.sprites.other['official-artwork'].front_default
        }
    };
};

export default fetchQuizData