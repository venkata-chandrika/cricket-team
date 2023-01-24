const express = require("express");
const app = express();
const { open } = require("sqlite");

const sqlite3 = require("sqlite3");
const path = require("path");
const dbpath = path.join(__dirname, "cricketTeam.db");
let db = null;
const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbpath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("server is running at given url");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};
initializeDBAndServer();
//App API 1 Path: /players/
app.get("/players/", async (request, response) => {
  const getQuery = `SELECT * FROM cricket_team `;
  const arrayResult = await db.all(getQuery);
  response.send(arrayResult);
});
app.use(express.json());
//post API2
app.post("/players/", async (request, response) => {
  const playerDetails = request.body;
  console.log(playerDetails);
  const { player_name, jersey_number, role } = playerDetails;
  const postQuery = `INSERT INTO cricket_team  (player_name,jersey_number,role)
  VALUES 
  ('${player_name}',${jersey_number},'${role}')`;
  await db.run(postQuery);
  response.send("Player Added to Team");
});

//API 3 get Path: /players/:playerId/
app.get("/players/:playerId/", async (request, response) => {
  const playerId = request.params;
  const getPlayerDetails = `
            SELET * FROM cricket_team
            WHERE player_id=${playerId}`;
  const player = await db.get(getPlayerDetails);
  response.send(player);
});
//API 4 Path: /players/:playerId/ PUT

app.put("/players/:playerId/", async (request, response) => {
  const playerId = request.params;
  const playerDetails = request.body;
  const { player_name, jersey_number, role } = playerDetails;
  const updateQuery = `UPDATE cricker_team SET 
  player_name=${player_name},jersey_number=${jersey_number},role=${role}`;
  await db.run(updateQuery);
  response.send("Player Details Updated");
});
//API 4 Path: /players/:playerId/Method: DELETE
app.delete("/players/:playerId/", async (request, response) => {
  const playerId = request.params;
  const deleteQuery = `DELETE FROM cricket_team WHERE player_id=${playerId}`;
  await db.run(deleteQuery);
  response.send("Player Removed");
});
module.exports = app;
