# UFFFD's ShaderToy Buddy

**WebExtension** for **Shadertoy** to help you code using GPT and other misc tools.

## 🚨 INCOMPLETE / WIP 🚨

#### To Do: 
- [x] Fix state storage/loading
- [x] Connect Prompt input to prompt execution
- [x] Conversational mode (ask questions about code, get answers)
    - [x] Create better interface for responses than the console
- [x] Edit mode (give prompt, code gets edited)
- [x] System prompt
- [~] Move prompt handling / ai to separate function/class
    - function started, but not yet implemented
- [ ] Add default helpful prompts
    - "Fix any errors in the code"
    - "Explain"/"Add comments"
    - "Make verbose / ungolf"
    - "Make concise"
    - "Add a random new feature"
    - [~] Write and test prompts
    - [ ] Add UI to trigger prompts
- [ ] Add system to store and reuse prompts
    - customize existing prompts, hide defaults, manage custom prompts
- [x] error handling (ie low funds, bad key, failed request)
- [ ] disable button if openai key missing, replace input prompt with link to extension window or something along those lines


# Installing:

## Stores: 

[Chrome extension not available yet](#)

## Manual installation

Download latest **zip** from [Releases](https://github.com/kylegrover/shadertoy-buddy/releases)

## Google Chrome
1. Download the extension from the provided link and unzip it.
2. Open Chrome and go to `chrome://extensions/`.
3. In the top right corner, enable developer mode.
4. Drag and drop downloaded file.

## Mozilla Firefox
1. Download the extension from the provided link and unzip it.
2. Open Firefox and go to `about:debugging`.
3. Click `This Firefox`.
4. Click `Load Temporary Add-on…` and select the manifest.json file in the folder with the unpacked extension.

## Microsoft Edge
1. Download the extension from the provided link and unzip it.
2. Open Edge and go to `edge://extensions/`.
3. In the top right corner, enable developer mode.
4. Click `Load unpacked` and select the folder with the unpacked extension.


## Features:

- **Ask GPT About Your Code** using your api key, model, and system prompt preference
- **Edit Your Code** using GPT to generate a new code block
- ~~**Agent Mode**~~ (not yet implemented)
- ~~**Shadertoy VectorDB Search**~~ (not yet implemented - would require a server to host the vector database, might require payment)

---

## Author / Contact:

[UFFFD](http://ufffd.com)

## Contributors:

Plugin framework based on [Shadertoy unofficial plugin.](https://github.com/patuwwy/ShaderToy-Chrome-Plugin) by [PatrykFalba (Patu)](http://patrykfalba.pl)
