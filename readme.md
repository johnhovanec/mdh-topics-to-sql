# MDH Topics to SQL Scripts

These scripts aim to take the old topics.js config file and convert that data into T-Sql scripts to insert that data  
into the MDH database.

## Converting topics.js to valid JSON

The current topics.js file is not valid JSON so this script expects each Tab of a topic to converted to valid JSON **before**
running this script.

Note that when running topics.js contents through conversion, the url environment process and all comments must be removed  
in order to convert it to valid JSON. Each JSON file corresponding to a Tab has been saved within the `topics` directory  
of this project.

### topicsForSql.json

This file is used as a convenience to copy each Tab's JSON content in order to not have to modify `loadSql.js` to point  
to a new file. The contents of a given Tab's JSON output was copied into this file, and then loadSql.js was run to parse  
that into T-Sql scripts.

## Output

The scripts currently log to the console the sql commands. From there the sql commands can be reviewed or copied into  
SSMS to be run.
