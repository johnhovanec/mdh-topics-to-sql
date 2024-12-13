# MDH Topics to SQL Scripts

These scripts aim to take the old topics.js config file and convert that data into T-Sql scripts to insert that data  
into the MDH database.

## Converting topics.js to valid JSON

The current topics.js file is not valid JSON so this script expects each Tab of a topic to converted to valid JSON **before**
running this script.

ChatGPT does a good job of taking a pasted topic from topics.js and converting it to valid JSON. Note that if it can't  
figure out a field it will replace it with an all-caps placeholder value. For example, for a `url` property it can't  
decode it will provide a value of `URL_PLACEHOLDER`.
