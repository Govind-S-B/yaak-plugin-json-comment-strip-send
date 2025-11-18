# JSON Comment Strip & Send Plugin for Yaak

<img width="2998" height="1858" alt="image" src="https://github.com/user-attachments/assets/3db818ab-37a2-4d1a-8b07-f609d1961b68" />


## What It does
Write JSON with comments directly in the request body editor (Only `application/json` body types)
Supports `//` single-line comments and `/* */` multi-line comments. Comments within strings are preserved

## How to Use
Option 1
- Right Click on the request and choose "Send (Strip Comments)
Option 2 (I recommend)
- Hit Cmd K
- Type comments or send and hit enter after choosing the correct command, it is usually at the top

## Motive
I often want to test with a filter param switched on or have a few fields disabled really quick, maybe comment in some ids I want to test for. Duplicating the request is too much for these, so made this real quick.

## Dev Notes
- Ideally I would have loved for the plugin to strip comments with the default send option, but I couldnt find any method inside the API
- I would have loved to add my own shortcut, but its something in the feature roadmap todos
- I have a feeling this is going to break when JSON validation comes out
