createdb sh_dbbb
psql -h 127.0.0.1 -p 5432 -d sh_dbbb < database.sql
psql -U sh_admin -h 127.0.0.1 -p 5432 -d sh_dbbb < scavenger_hunt_db.sql