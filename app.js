const express = require("express");

const app = express();

const morgan = require("morgan");
const pokeBank = require("./pokeBank");

app.use(morgan("dev"));

app.use(express.static("public"));

const Pokemon = require('./models/Pokemon');

app.get('/pokemon', async (req, res) =>{
  const pokemon = await Pokemon.findAll();
  res.json(pokemon);
});



app.get("/", (req, res) => {
  const pokemonList = pokeBank.list();
  let html = "<header><img src='/logo.png'/></header><h1>Pokedex</h1>";
  html += "<title>My Pokedex</title><link rel='stylesheet' href='/style.css' />";
  pokemonList.forEach((pokemon) => {
    html += `<div><img class="pokemon-img" src=${pokemon.image} /><p><a href="/pokemon/${pokemon.id}">${pokemon.name}</a></p></div>`;
  });
  res.send(html);
});

app.get("/pokemon/:id", (req, res) => {
  const pokemon = pokeBank.find(req.params.id);
  if (!pokemon.id) {
    res.status(404);
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>My Pokedex</title>
      <link rel="stylesheet" href="/style.css" />
    </head>
    <body>
      <header><img src="/logo.png"/></header>
        <p>Pika pika... Page Not Found</p>
    </body>
    </html>`;
    res.send(html);
  } else {
    let html = `<link rel='stylesheet' href='/style.css' /><img class="pokemon-img" src=${pokemon.image} /><h1>${pokemon.name}</h1>`;
    html += `<p>Type: ${pokemon.type}</p>`;
    html += `<p>Trainer: ${pokemon.trainer}</p>`;
    html += `<p>Date: ${pokemon.date}</p>`;
    res.send(html);
  }
});

app.get("/pokemon/:id", async (req, res) => {
  const pokemon = await Pokemon.findByPk(req.params.id);
  if (pokemon) {
    res.json(pokemon);
  } else {
    res.status(404).send("Pokemon not found");
  }
});

app.post("/pokemon", async (req, res) => {
  const newPokemon = await Pokemon.create(req.body);
  res.json(newPokemon);
});

app.put("/pokemon/:id", async (req, res) => {
  const pokemon = await Pokemon.findByPk(req.params.id);
  if (pokemon) {
    await pokemon.update(req.body);
    res.json(pokemon);
  } else {
    res.status(404).send("Pokemon not found");
  }
});

app.delete("/pokemon/:id", async (req, res) => {
  const pokemon = await Pokemon.findByPk(req.params.id);
  if (pokemon) {
    await pokemon.destroy();
    res.status(204).send();
  } else {
    res.status(404).send("Pokemon not found");
  }
});


const PORT = 3000;
app.listen(PORT, () => {
  console.log(`server is listening on port ${PORT}`);
});
