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
        console.clear();
        resetPokemon();
        resetSearch();
        setLoading(true);
        setCount(0);

        document.querySelector('#load-dex').innerText = 'Reload Pokédex';
        document.querySelector('.toggle').style.visibility = 'visible';
        
        await fetch('https://pokeapi.co/api/v2/pokemon?limit=21')
        .then(res => res.json())
        .then(data => Promise.all(data.results.map(pokemon => fetchPokeData(pokemon))))
        .catch(err => console.log(err));

        setCount(prevCount => prevCount + 20);

    }

    const fetchPokeData = (pokemon) => {

        const pokeArr = [];
    
        fetch(pokemon.url)
        .then(res => res.json())
        .then(p => {
            pokeArr.push(p)
        })
        .catch(err => console.log(err));

        pokeArr.sort((a, b) => a.id - b.id);
        setTimeout(() => {
            pokeArr.map(poke => {
                setPokemon(poke);
                console.log(poke.id, poke.name);
            })
        }, 1500)

        

    }

    const setPokemon = (poke) => {
        setLoading(false);

        let output = document.getElementById('output');
        let name = poke.name.charAt(0).toUpperCase() + poke.name.slice(1);
        let id = ("00" + poke.id).slice(-3)
        let pokeTypes = poke.types;
        let types = pokeTypes.map((pokeType) => pokeType.type.name);
        let type = types.map(type => type.charAt(0).toUpperCase() + type.slice(1));

        output.innerHTML += `
            <div class='pokemon-container'>
                <img id="poke-pic" src='https://img.pokemondb.net/sprites/bank/normal/${poke.name}.png'/>
                <div id='poke-info'>
                    <div id="poke-id">#${id}</div>
                    <div id="poke-name">${name}</div>
                    <div class="type-container">
                        <span class="type-block" id="${types[0]}">${type[0]}</span>
                        <span class="type-block" id="${types[1] ? types[1] : ''}" style="${!types[1] && 'display:none'}">${type[1] ? type[1] : ''}</span>
                    </div>
                </div>
            </div>
        `;
    }

    const searchPokedex = async () => {
        const input = document.querySelector('#search');
        const query = input.value.toLowerCase();
        resetPokemon();
        resetLoadBtn();
        setLoading(true);


        await fetch(`https://pokeapi.co/api/v2/pokemon/${query}`)
        .then(res => res.json())
        .then(poke => setPokemon(poke))
        .catch(err => console.log(err));

    }

    const getRandom = async () => {
        const random = Math.floor((Math.random() * 721) + 1);

        setLoading(true);
        resetPokemon();
        resetSearch();
        resetLoadBtn();
        document.querySelector('.toggle').style.visibility = 'hidden';

        await fetch(`https://pokeapi.co/api/v2/pokemon/${random}`)
        .then(res => res.json())
        .then(poke => setPokemon(poke))
        .catch(err => console.log(err));

    }

    const loadMore = async () => {
        setLoading(true);
        setCount(prevCount => prevCount + 20);
        
        await fetch(`https://pokeapi.co/api/v2/pokemon?offset=${count}&limit=21`)
        .then(res => res.json())
        .then(data => data.results.forEach(pokemon => fetchPokeData(pokemon)))
        .catch(err => console.log(err));

    }

    const resetPokemon = () => {
        const output = document.getElementById('output');
        output.innerHTML = '';
    }

    const resetLoadBtn = () => {
        document.querySelector('#load-dex').innerText = 'Load Pokédex';
    }

    const resetSearch = () => {
        document.querySelector('#search').value = '';
    }

    const goTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }


    return(
        <div className="text-center pokedex">
            <div className="nav-bar">
                <button onClick={getPokedex} className="btn" id="load-dex">Load Pokédex</button>
                <input 
                    className="rounded-lg" 
                    type="text" 
                    id="search" 
                    onChange={searchPokedex}
                    placeholder="Search for a Pokémon..."
                    autocomplete="off" 
                />
                <div className="btn" onClick={getRandom}>Randomize <i className="fas fa-random"></i></div>
                <div onClick={goTop} className="btn fade-in fas fa-arrow-circle-up fa-2x"
                id="goTop"></div>
            </div>

            <div id="output" className="m-4"></div>
            <div className="loader-wrapper">
                { loading ? 
                    <div className="loader">
                        <img width="10%" src="https://www.freeiconspng.com/thumbs/pokeball-png/file-pokeball-png-0.png" />
                    </div>
                : 
                <div onClick={loadMore} className="btn toggle">Load More...</div>
                }
            </div>
        </div>
    ) 

}

ReactDOM.render(<App />, document.getElementById('root'));
