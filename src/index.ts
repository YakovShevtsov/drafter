import express from "express";
import type { OpenDotaHero, OpenDotaMatchup } from "./types/opendota.js";

const app = express();

const PORT = 3000;

app.get("/", (req, res) => {
  res.send("Draft helper backend is alive!");
});

app.get("/hero/:id/matchups", async (req, res) => {
  const heroId = req.params.id;

  try {
    const [matchupsRes, heroesRes] = await Promise.all([
      fetch(`https://api.opendota.com/api/heroes/${heroId}/matchups`),
      fetch("https://api.opendota.com/api/heroes/"),
    ]);

    const matchups: OpenDotaMatchup[] = await matchupsRes.json();
    const heroes: OpenDotaHero[] = await heroesRes.json();

    const heroNameById = new Map(
      heroes.map((hero) => [hero.id, hero.localized_name]),
    );

    const enriched = matchups.map((matchup) => ({
      hero_id: matchup.hero_id,
      hero_name: heroNameById.get(matchup.hero_id) ?? "Unknown",
      games_played: matchup.games_played,
      win_rate: Number(
        ((matchup.wins / matchup.games_played) * 100).toFixed(1),
      ),
    }));

    res.json(enriched);
  } catch (error) {
    console.error(error);

    res.status(500).json({ error: "Failed to fetch matchups" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
