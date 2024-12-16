# MDH Topics to SQL Scripts

These scripts aim to take the old topics.js config file and convert that data into T-Sql scripts to insert that data  
into the MDH database.

## Converting topics.js to valid JSON

The current topics.js file is not valid JSON so this script expects each Tab of a topic to converted to valid JSON **before**
running this script.

Note that when running topics.js contents through conversion, the url environment process and all comments must be removed  
in order to convert it to valid JSON.

## Output

The scripts currently log to the console the sql commands. From there the sql commands can be reviewed or copied into  
SSMS to be run.
