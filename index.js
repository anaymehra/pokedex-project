import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

app.get("/", async (req,res)=>{
    const randomNo = Math.floor((Math.random()*151)+1);

    const result = await axios.get("https://pokeapi.co/api/v2/pokemon/"+randomNo);
    const colorUrl = result.data.species.url;
    const color = await axios.get(colorUrl);
    const colorName = color.data.color.name;
    const data = {
        name : result.data.forms[0].name.charAt(0).toUpperCase() + result.data.forms[0].name.slice(1),
        img : result.data.sprites.front_default,
        weight : result.data.weight / 10,
        height : (result.data.height / 3.048).toFixed(2),
        type : result.data.types[0].type.name.charAt(0).toUpperCase() + result.data.types[0].type.name.slice(1),
        color : colorName
    }
    
    res.render("index.ejs",data);
});
app.post("/poke-name", async (req, res) => {
    try {
        const pokeName = req.body.pokemon.toLowerCase();
        const result = await axios.get("https://pokeapi.co/api/v2/pokemon/" + pokeName);
        const colorUrl = result.data.species.url;
        const color = await axios.get(colorUrl);
        const colorName = color.data.color.name;
        const data = {
            name: result.data.forms[0].name.charAt(0).toUpperCase() + result.data.forms[0].name.slice(1),
            img: result.data.sprites.front_default,
            weight: result.data.weight / 10,
            height: (result.data.height / 3.048).toFixed(2),
            type: result.data.types[0].type.name.charAt(0).toUpperCase() + result.data.types[0].type.name.slice(1),
            color: colorName,
        };
        res.render("index.ejs", data);
    } catch (error) {
        if (error.response.status === 404) {
            res.status(404).render("error.ejs", { message: "Pokémon not found!" });
        } else {
            console.error("Error fetching Pokémon:", error.message);
            res.status(500).render("error.ejs", { message: "Server error. Please try again later." });
        }
    }
});

app.listen(port,()=>{
    console.log(`Server running on port ${port}`);
})