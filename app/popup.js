class Popup {
    constructor() {
        this.bindApiKeyInput();
        this.bindUseGPT4();
        this.bindSystemPrompt();

        this.init();
    }

    init() {
        this.sendMessage(
            {
                get: 'state'
            },
            (response) => {
                console.log(response);
                document.getElementById('input-use-gpt4').checked =
                    response.model === 'gpt-4-1106-preview'
                document.getElementById('input-openai-key').value =
                    response.openaiKey
                document.getElementById('input-system-prompt').value =
                    response.systemPrompt
            }
        );

        window.addEventListener('click', (event) => {
            if (event.target.href) {
                chrome.tabs.create({ url: event.target.href });
            }
        });

        document.getElementById('version').innerText =
            'v' + chrome.runtime.getManifest().version;
    }

    /**
     * Sets listener for alternate profile page select element.
     */
    bindUseGPT4() {
        document
            .getElementById('input-use-gpt4')
            .addEventListener('change', (event) => {
                this.sendMessage({
                    set: {
                        model: event.target.checked ? 'gpt-4-1106-preview' : 'gpt-3.5-turbo'
                    }
                });
            });
    }

    bindApiKeyInput() {
        document
            .getElementById('input-openai-key')
            .addEventListener('change', (event) => {
                this.sendMessage({
                    set: {
                        openaiKey: event.target.value
                    }
                });
            });
    }

    bindSystemPrompt() {
        document
            .getElementById('input-system-prompt')
            .addEventListener('change', (event) => {
                this.sendMessage({
                    set: {
                        systemPrompt: event.target.value
                    }
                });
            });
    }

    /**
     * Sends chrome message.
     */
    sendMessage(data, callback) {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.tabs.sendMessage(
                tabs[0].id,
                {
                    data: data
                },
                (res) => {
                    if (typeof callback === 'function') {
                        callback(res);
                    }
                }
            );
        });
    }
}

new Popup();
