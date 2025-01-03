# MDH Topics to SQL Scripts

These scripts aim to take the old `topics.js` config file and convert that data into T-SQL scripts to insert that data  
into the MDH database. Hopefully, this was a one-time process that will not need to be repeated.

## Notes regarding automation

These scripts do not fully automate the process of converting `topics.js` to SQL scripts. The goal was to speed up the conversion  
process to make it faster and more accurate, but it still requires a fair amount of manual work to copy, paste, and update  
the relevant database primary key values in order to run this script.

## Converting topics.js to valid JSON

The current `topics.js` file is not valid JSON so this script expects each Tab of a topic to converted to valid JSON **before**
running this script.

Note that when running `topics.js` contents through conversion, the url environment process and all comments must be removed  
in order to convert it to valid JSON. Each JSON file corresponding to a Tab has been saved within the `topics` directory  
of this project and is named according to the theme and tab it relates to. Start with these files if this process ever  
needs to be redone.

### topicsForSql.json

This file is used as a convenience location to copy each Tab's JSON content in order to not have to modify `loadSql.js`  
to point to a new file for each tab processed. The contents of a given Tab's JSON output was copied into this file, and then  
`loadSql.js` was run to parse that into T-Sql scripts.

### Values to set

Since the contents of `topics.js` is spread amongst numerous tables, certain information is needed to add this data to the  
database that is not known by the javascript environment or `topics.js`, namely the value for foreign keys. These values  
will need to be queried and manually updated in order to add data to the correct topic, theme, tab, chart, map, table or  
ncdm.

Key values to set within `loadSql.js` include:

- theme_ID
- tab_ID
- mapSet_ID
- drawingInfo_ID

## Output

The scripts currently log to the console the sql commands. From there the sql commands can be reviewed or copied into  
SSMS to be run.
