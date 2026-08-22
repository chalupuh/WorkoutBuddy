# Falcon Bench Club — Season 1

A self-contained, browser-based 16-week workout and points tracker.

## Run it

Open `index.html` directly in a modern browser, or serve the folder locally:

```powershell
node serve.mjs
```

Then visit `http://localhost:4173`.

All member profiles, workout logs, points, ranks, and results are stored locally in the browser. No account or database is required.

## Backups

Open **Members → Backup & restore** to protect browser-only data:

- **Save backup file** creates a portable JSON file containing the current season, logs, roster, challenges, accessories, and archived seasons. On iPad, save it to iCloud Drive or **On My iPad** after each meetup.
- **Restore from file** validates a Workout Buddy backup and restores it after confirmation.
- The app also retains up to six rolling local checkpoints for accidental-edit recovery. These checkpoints remain in the same browser cache and therefore do not replace portable backup files.

## Program and points

- Weeks 4, 8, and 12 are calendar-protected recovery weeks.
- One missed prescription repeats once; two consecutive misses trigger a 7.5% load reset.
- Weeks 13–15 taper from a triple to crisp singles, and Week 16 uses three planned attempts.
- Weekly scoring labels change with the phase so recovery, technique, volume, peak execution, and test-day results earn the points appropriate to that week.
- Each week offers a maximum of 45 points: four clear 5-point objectives, 10 points for the weekly challenge winner, 5 points for the runner-up, and 10 points for the Competition Bench AMRAP Champ.
- The other-workout target increases from one workout in Weeks 1–4, to two in Weeks 5–8, and caps at three workouts in Weeks 9–16. Any intentional workout counts; gym access is not required.
- Week 16 results can become each member's next-season max. Starting a new season archives the completed standings and resets weekly logs.
