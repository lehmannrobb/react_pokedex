function App() {

    return (
        <div className="container">
            <Header />
            <Pokedex />
        </div>
    )
}

const Header = () => {
    return (
        <div id="banner" className="text-center mt-4 card">
            <h1>
                <img 
                width="10%" 
                src="https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/f4398528-5ab6-40cf-b4ee-da3001470705/dbx4hvm-7d756e36-fe80-427a-8b3a-48949cbcb696.png/v1/fill/w_400,h_431,strp/pokemon_go_gym_symbol_in_gray_by_memimouse_dbx4hvm-fullview.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9NDMxIiwicGF0aCI6IlwvZlwvZjQzOTg1MjgtNWFiNi00MGNmLWI0ZWUtZGEzMDAxNDcwNzA1XC9kYng0aHZtLTdkNzU2ZTM2LWZlODAtNDI3YS04YjNhLTQ4OTQ5Y2JjYjY5Ni5wbmciLCJ3aWR0aCI6Ijw9NDAwIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmltYWdlLm9wZXJhdGlvbnMiXX0.3tI8HjR3yv49xaMzVfj3yt7Vs6scqnsgTpWj7-LXV_w"
                id="logo"
                />
                Pokédex
            </h1>
        </div>
    )
}

const Pokedex = () => {
    const [loading, setLoading] = React.useState(false);

    const getKanto = () => {
        resetPokemon();
        setLoading(true);
        fetch('https://pokeapi.co/api/v2/pokemon?limit=151')
        .then(res => res.json())
        .then(data => {
            data.results.forEach(pokemon => fetchPokeData(pokemon));
        })
        .catch(err => console.log(err));
        setLoading(false);

    }

    const getJohto = () => {
        resetPokemon();
        setLoading(true);
        fetch('https://pokeapi.co/api/v2/pokemon?limit=100&offset=151')
        .then(res => res.json())
        .then(data => {
            data.results.forEach(pokemon => fetchPokeData(pokemon));
        })
        .catch(err => console.log(err));
        setLoading(false);

    }

    const fetchPokeData = async (pokemon) => {
        try {
            const url = pokemon.url;
            const res = await fetch(url);
            const pokeData = await res.json();
            setPokemon(pokeData);
            console.log(pokeData.id);

        }   catch(err) {
                console.log(err);
        }
    }

    const setPokemon = (pokeData) => {
        let output = document.getElementById('output');
        let name = pokeData.name.charAt(0).toUpperCase() + pokeData.name.slice(1);
        let id = ("00" + pokeData.id).slice(-3)
        let pokeTypes = pokeData.types;
        let types = pokeTypes.map((pokeType) => pokeType.type.name);
        let type = types.map(type => type.charAt(0).toUpperCase() + type.slice(1));

        output.innerHTML += `
            <div class='pokemon-container'>
                <img id="poke-pic" src='https://img.pokemondb.net/sprites/bank/normal/${pokeData.name}.png'/>
                <div id='poke-info'>
                    <div id="poke-id">#${id}</div>
                        <hr>
                    <div id="poke-name>${name}</div>
                        <hr>
                    <div class="type-container">
                        <span class="type-block" id="${types[0]}">${type[0]}</span>
                        <span class="type-block" id="${types[1] ? types[1] : ''}">${type[1] ? type[1] : ''}</span>
                    </div>
                </div>
            </div>
        `;
    }

    const resetPokemon = () => {
        const output = document.getElementById('output');
        output.innerHTML = '';
    }


    return(
        <div className="text-center pokedex">
            <div className="nav-bar">
                <button onClick={getKanto} className="btn">Load Kanto Pokédex</button>
                <button onClick={getJohto} className="btn">Load Johto Pokédex</button>
            </div>
            <div id="loading">{ loading ? ('Loading Pokédex...') : ''}</div>
            <div id="output" className="m-4"></div>
        </div>
    ) 

}

ReactDOM.render(<App />, document.getElementById('root'));