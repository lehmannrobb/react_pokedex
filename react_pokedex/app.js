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
                src="https://www.freeiconspng.com/thumbs/pokeball-png/file-pokeball-png-0.png"
                id="logo"
                />
                National Pokédex
            </h1>
        </div>
    )
}

const Pokedex = () => {
    const [loading, setLoading] = React.useState(false);
    const [count, setCount] = React.useState(0);

    document.addEventListener("scroll", (e) => {
        if (document.documentElement.scrollTop > 400) {
            document.querySelector('#goTop').style.opacity = '100%';
        }   else {
            document.querySelector('#goTop').style.opacity = '0%';
            }
    });

    const getPokedex = async () => {
        resetPokemon();
        setLoading(true);

        document.querySelector('.toggle').style.visibility = 'visible';
        setCount(prevCount => prevCount + 20);
        await fetch('https://pokeapi.co/api/v2/pokemon?limit=20')
        .then(res => res.json())
        .then(data => data.results.forEach(pokemon => fetchPokeData(pokemon)))
        .catch(err => console.log(err));
        setLoading(false);
    }

    const fetchPokeData = async (pokemon) => {
        try {
            const url = pokemon.url;
            const res = await fetch(url);
            const pokeData = await res.json();
            setPokemon(pokeData);
            console.log(pokeData.id, pokeData.name);

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
                    <div id="poke-name">${name}</div>
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

    const goTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth"});
    }

    const loadMore = async () => {
        setLoading(true);
        setCount(prevCount => prevCount + 20);
        await fetch(`https://pokeapi.co/api/v2/pokemon?offset=${count}&limit=20`)
        .then(res => res.json())
        .then(data => data.results.forEach(pokemon => fetchPokeData(pokemon)))
        .catch(err => console.log(err));
        setLoading(false);

    }


    return(
        <div className="text-center pokedex">
            <div className="nav-bar">
                <button onClick={getPokedex} className="btn">Load Pokédex</button>
                <div onClick={goTop} className="btn fade-in fas fa-arrow-circle-up fa-2x"
                id="goTop"></div>
            </div>
            <div id="loading">{ loading ? ('Loading Pokédex...') : ''}</div>
            <div id="output" className="m-4"></div>
            <div onClick={loadMore} className="btn toggle">Load more...</div>
        </div>
    ) 

}

ReactDOM.render(<App />, document.getElementById('root'));
