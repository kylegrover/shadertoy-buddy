/* global gShaderToy, dataLoadShader, window, document, Effect */

(function shadertoyBuddy() {
    'use strict';

    /**
     * Arrow keys time change (ms).
     *
     * @type {number}
     */
    var STATE_STORAGE_KEY = 'STB-state',
        /**
         * Stores references to ShaderToy HTML elements.
         */
        shaderToyElements = {
            leftColumnContainer: document.querySelector('.container > .block0'),
            rightColumnContainer: document.querySelector('.container > .block1'),
            toolBar: document.querySelector('.container > .block1 > #toolBar')
        },
        extensionElements = {};

    /**
     * ToyBuddy.
     *
     * @contructor
     */
    class ToyBuddy {
        state = {};
        constructor() {
            if (!this.initialized) {
                this.init();
            }

            this.initialized = true;
        }
        /**
         * Render a template by substituting {tag}s in #template from #values.
         * Tags in #template will be replaced only if there is a corresponding
         * element in #values.  Other tags will be left untouched.
         *
         * @param template {String} the template to fill in
         * @param values {Object} the values to fill in.
         */
        renderTemplate(template, values) {
            if (!template || typeof template !== 'string') {
                // Sane output for invalid input
                return '';
            }

            values = values || {};

            if (typeof values !== 'object') {
                // If invalid input, no changes.
                return template;
            }

            var result = template.replace(/{([^}]+)}/g, function(match, key) {
                return values[key] || match;
            });

            // Regularize line endings, in case one of the inputs used \r\n
            result = result.replace(/\r\n|\r/g, '\n');

            return result;
        }

        /**
         * @returns {boolean} True if current page is editor page.
         */
        isEditPage() {
            return document.location.href.match(/(.com\/view|.com\/new)/);
        }

        /**
         * Inits ToyBuddy functionality.
         */
        init() {
            this.state = JSON.parse(window.localStorage.getItem(STATE_STORAGE_KEY) || "{}");

            if (!this.state) {
                window.localStorage.setItem(STATE_STORAGE_KEY, JSON.stringify({}));
                this.state = {};
            }

            console.log(this.state)
            this.common = new ToyBuddyCommon();

            if (this.isEditPage()) {
                this.editPage = new ToyBuddyEditPage();
            }

            this.setListener();
        }

        setListener() {
            document.addEventListener('STB:mainState:updated', (event) => {
                const detail = event.detail;
            });
        }
    }

    /**
     * Provides functionality for every type of shadertoy page.
     *
     * @constructor
     */
    class ToyBuddyCommon {
        /**
         * Download a blob to the user's disk.
         * @param filename {String} The filename to save
         * @param blob {Blob} The data to save
         */
        downloadBlob(filename, blob) {
            var link = window.document.createElement('a');

            link.href = window.URL.createObjectURL(blob);
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }

        /**
         * Download a JSON file of the provided data
         */
        downloadJson(filename, data) {
            var blob = new window.Blob([ data ], { type: 'application/json' });

            this.downloadBlob(filename, blob);
        }
    }

    /**
     * Provides additional functionality to Shadertoy's edit page.
     *
     * @constructor
     */
    class ToyBuddyEditPage {
        constructor() {
            this.init();
            let ok = false;
        }

        /**
         * Initializes.
         */
        init() {

            /**
             * Main Shadertoy canvas HTML id attribute.
             *
             * @type {string}
             */
            this.MAIN_SHADERTOY_DEMO_ID = 'demogl';

            /**
             * Main Shadertoy canvas (shader holder).
             *
             * @type {HTMLElement}
             */
            this.c = document.getElementById(this.MAIN_SHADERTOY_DEMO_ID);

            /**
             * Current Shadertoy demo canvas resolution divider.
             *
             * @type {number}
             */
            this.currentDivider = 1;
            this.bindKeys();

            if (!this.createContainers()) {
                return;
            }

            // Create new UI controls
            this.promptInput = new PromptInput();

            // this.uploadShader();
        }

        /**
         * Creates containers for extension elements.
         */
        createContainers() {
            try {
                extensionElements.promptContainer = document.createElement(
                    'div'
                );
                extensionElements.promptContainer.classList.add(
                    'toybuddy-prompt-container'
                );

                shaderToyElements.rightColumnContainer.insertBefore(
                    extensionElements.promptContainer,
                    shaderToyElements.toolBar
                );

                return true;
            } catch (e) {
                console.error(e);

                return false;
            }
        }

        /**
         * Attaches additional keys support.
         */
        bindKeys() {
            var self = this;

            document.addEventListener('keydown', function(e) {
                var which = e.which,
                    code = e.code;
                //  used by STE already:
                    // 1...9 Keys & arrow keys already
                    // shift + ctrl + enter
                    // shift + ctrl + s
                
                // shift + enter
                // if (e.which === 13 && e.shiftKey) {
                //     self.runPrompt();
                // }
            });
        }
    }

    function runPrompt(
        prompt, 
        handleResult=()=>{console.log('no handleResult set')}, 
        callback=()=>{console.log('no callback set')}, 
        temperature=0.7, maxTokens=256, 
        system_prompt=window.ToyBuddy.state.systemPrompt
    ) {// run prompt
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer `+window.ToyBuddy.state.openaiKey);

        const system_msg = {"role": "system", "content": system_prompt}

        var prompt_msg;
        if (typeof prompt === 'string')
            prompt_msg = {"role": "user", "content": prompt};
        else if (typeof prompt === 'object')
            prompt_msg = prompt;
        else
            console.error("Bad prompt type", typeof prompt, prompt);
        
        var raw = JSON.stringify({
          "model": window.ToyBuddy.state.model,
          "messages": [system_msg, prompt_msg],
          "temperature": 0.7
        });
        
        var requestOptions = {
          method: 'POST',
          headers: myHeaders,
          body: raw,
          redirect: 'follow'
        };
        
        fetch("https://api.openai.com/v1/chat/completions", requestOptions)
          .then(response => response.text())
          .then(result => handleResult(result))
          .catch(error => {
            console.log('error', error)
            alert("Error: "+error)
          })
          .finally(callback);
    }

    class PromptInput {
        constructor() {
            this.addInput();
            this.addModeSelect();
            this.addButton();
        }

        addInput() {
            this.input = document.createElement('input');
            this.input.classList.add('stb-prompt-input');
            this.input.setAttribute('placeholder', 'Enter prompt here');
            // this.input.addEventListener('change', (event) => {

            extensionElements.promptContainer.appendChild(this.input);
        }

        addModeSelect() {
            // choose between append and replace ("edit" and "comment")
            this.modeSelect = document.createElement('select');
            this.modeSelect.classList.add('stb-prompt-mode-select');
            this.modeSelect.setAttribute('title', 'Choose mode');
            this.modeSelect.innerHTML = `<option value="append">Add Comment</option>`;
            this.modeSelect.innerHTML += `<option value="replace">Edit Code</option>`;
            
            extensionElements.promptContainer.appendChild(this.modeSelect);
        }

        addButton() {
            this.button = document.createElement('div');
            this.button.classList.add(
                'formButton'
            );
            this.button.setAttribute('title', 'Run prompt');
            this.button.textContent = 'Run prompt';
            this.button.addEventListener(
                'click',
                this.onButtonClick.bind(this)
            );

            extensionElements.promptContainer.appendChild(this.button);
        }

        onButtonClick(event) {
            // run prompt
            const prompt = this.input.value+"\n\n"+gShaderToy.mCodeEditor.getValue();

            const shouldUpdate = this.modeSelect.value == "replace";
            this.button.textContent = 'Running...'
            this.button.disabled = true;

            runPrompt(
                prompt, 
                (result) => this.handleResult(result), 
                () => {
                    this.button.textContent = 'Run prompt'; 
                    this.button.disabled = false;
                }
            );

            event.stopPropagation();
        }

        handleResult(result, updateCode = false) {
            const response = JSON.parse(result);
            console.log(response)
            if (!response.choices || response.choices.length == 0) {
                console.error("Bad/No response from GPT", response);
                throw "Bad/No response from GPT";
                return;
            }
            const prompt = response.choices[0].prompt;
            const text = response.choices[0].message.content;
            console.log(text);
            if (updateCode)
                gShaderToy.mCodeEditor.setValue(text);
            else
                gShaderToy.mCodeEditor.setValue(gShaderToy.mCodeEditor.getValue() + "\n\n/*\n"+text+"\n*/");
        }
    }

    window.ToyBuddy = window.ToyBuddy || new ToyBuddy();
})(document, window);
