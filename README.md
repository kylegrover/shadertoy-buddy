# UFFFD's ShaderToy Buddy

**WebExtension** for **Shadertoy** to help you code using GPT and other misc tools.

## Features:

- **Ask GPT About Your Code** using your api key, model, and system prompt preference
- **Edit Your Code** using GPT to generate a new code block
- ~~**Agent Mode**~~ (not yet implemented)
- ~~**Shadertoy VectorDB Search**~~ (not yet implemented - would require a server to host the vector database, might require payment)

## Quick install: [Chrome](https://chromewebstore.google.com/u/1/detail/ufffds-shadertoy-buddy/kelehbbdpaochlhjonmfhjancdnlhhgc?hl=en)

## Manual install:

0. Download latest **zip** from [Releases](https://github.com/kylegrover/shadertoy-buddy/releases)
1. Unzip the zip
   
**Google Chrome**

2. Open Chrome and go to `chrome://extensions/`.
3. In the top right corner, enable developer mode.
4. Drag and drop downloaded file.

**Mozilla Firefox**

2. Open Firefox and go to `about:debugging`.
3. Click `This Firefox`.
4. Click `Load Temporary Add-on…` and select the manifest.json file in the folder with the unpacked extension.

**Microsoft Edge**

2. Open Edge and go to `edge://extensions/`.
3. In the top right corner, enable developer mode.
4. Click `Load unpacked` and select the folder with the unpacked extension.


### To Do: 
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
    - add a new tab to the code editor panel? 'prompts'
- [x] error handling (ie low funds, bad key, failed request)
    - [ ] make it pretty
- [ ] disable button if openai key missing, replace input prompt with link to extension window or something along those lines
- [ ] add vision capability
    - https://platform.openai.com/docs/guides/vision
- [ ] handle tabs more betterish
- [ ] 
#### To Maybe:
- [ ] vectordb with shadertoy public shaders & article/docs knowledgebase?
- [ ] agent mode/prompt looping
- [ ] explore openais new 'assistant' and 'chatgpts' offerings


---

## Author / Contact:

[UFFFD](http://ufffd.com)

## Contributors:

Plugin framework based on [Shadertoy unofficial plugin.](https://github.com/patuwwy/ShaderToy-Chrome-Plugin) by [PatrykFalba (Patu)](http://patrykfalba.pl)
