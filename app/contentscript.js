(function() {
    'use strict';

    /**
     * Main extension script filename.
     *
     * @const {string}
     */
    var MAIN_EXTENSION_FILENAME = 'shadertoy-buddy.js',
        STATE_STORAGE_KEY = 'STB-state',
        state = {
            model: 'gpt-3.5-turbo',
            openaiKey: ''
        };

    /**
     * Load a script directly from our extension.  The script should be
     * listed in the manifest as a web_accessible_resource.
     * The script runs in the page's world, not in the extension's world.
     *
     * @param filename {String} the filename of the script within our extension
     * @param id {String} optional ID to assign to the <script> tag
     */
    function loadScript(filename, id) {
        var script = document.createElement('script');

        script.src = chrome.runtime.getURL(filename);
        //script.async = true;

        if (id) {
            script.id = id;
        }

        document.head.appendChild(script);
    }

    const restoreState = () => {
        const storedState = window.localStorage.getItem(STATE_STORAGE_KEY);

        if (storedState) {
            try {
                state = JSON.parse(storedState);
            } catch (_ignore) {}
        }

        onStateUpdate(state);
    };

    const saveState = (newState) => {
        let oldState = state;

        try {
            oldState =
                JSON.parse(window.localStorage.getItem(STATE_STORAGE_KEY)) ||
                state;
        } catch (_ignore) {}

        const changes = Object.keys(newState).reduce(
            (diff, key) =>
                oldState[key] === newState[key]
                    ? diff
                    : {
                          ...diff,
                          [key]: newState[key]
                      },
            {}
        );

        window.localStorage.setItem(
            STATE_STORAGE_KEY,
            JSON.stringify(newState)
        );

        onStateUpdate(changes);
    };

    const onStateUpdate = (changes) => {
        document.dispatchEvent(
            new CustomEvent('STB:mainState:updated', {
                detail: window.chrome ? changes : cloneInto(changes, window)
            })
        );
    };

    /**
     * Listens to extension messages.
     */
    function bindMessagesListener() {
        chrome.runtime.onMessage.addListener(function(
            request,
            _sender,
            sendResponse
        ) {
            if (request.data.get === 'state') {
                restoreState();
                sendResponse(state);
            }

            if (request.data.set) {
                saveState({ ...state, ...request.data.set });
            }
        });
    }

    /**
     * Sends initial message.
     */
    function sendInitialMessage() {
        chrome.runtime.sendMessage(
            {
                present: true
            },
            function() {}
        );
    }


    /**
     * Initializes extension.
     */
    function init() {
        loadScript(MAIN_EXTENSION_FILENAME);

        bindMessagesListener();
        sendInitialMessage();

        restoreState();
    }

    window.addEventListener('load', init);
})();
