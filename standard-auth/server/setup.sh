createdb new2
psql -h 127.0.0.1 -p 5432 -d new2 < database.sql
psql -h 127.0.0.1 -p 5432 -d new2 < scavenger_hunt_db.sql