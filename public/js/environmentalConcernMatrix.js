/**
 * # eC
 * Copyright(c) 2021 Stefano Balietti
 * MIT Licensed
 *
 * Displays an interface to measure users' social dominance orientation (S.D.O.)
 *
 * www.nodegame.org
 */
(function(node) {

    "use strict";

    node.widgets.register('eC', eC);

    // ## Meta-data

    eC.version = '0.1.0';
    eC.description = 'eCrix question.';

    eC.title = 'eC';
    eC.className = 'eC';


    var scales = {

        eC7: [
            // Affective aspects
            'I am afraid when I think about environmental conditions for future generations',
            'If we continue our current style of living, we are approaching an environmental catastrophe',
            'Watching TV or reading the news about environmental problems, I am often embarrassed and angry',
            // Cognitive aspects
            'The great majority of German people do not act in an environmentally responsible way',
            'There are limits of economic growth which the industrialized world has already reached or will reach very soon',
            'In my opinion, environmental problems are greatly exaggerated by proponents of the environmental movement',
            // Conative aspects
            'It is still true that politicians do much too little to protect the environment',
            'To protect the environment, we all should be willing to reduce our current standard of living',
            'Environmental protection measures should be carried out, even if this reduces the number of jobs in the economy',
        ],
    };

    scales.eC7s = [
        scales.eC7[0], scales.eC7[1], scales.eC7[2], scales.eC7[3],
        scales.eC7[4], scales.eC7[5], scales.eC7[6], scales.eC7[7], scales.eC7[8]
    ];

    // var choices = [
    //     '1 ' + '<hr/>' + 'Strongly Oppose',
    //     '2 ' + '<hr/>' + 'Somewhat Oppose',
    //     '3 ' + '<hr/>' + 'Slightly Oppose',
    //     '4 ' + '<hr/>' + 'Neutral',
    //     '5 ' + '<hr/>' + 'Slightly Favor',
    //     '6 ' + '<hr/>' + 'Somewhat Favor',
    //     '7 ' + '<hr/>' + 'Strongly Favor'
    // ];

    var choices = [ 1,2,3,4,5 ];

    var header = [
        'Strongly disagree',
        'Partially disagree',
        'Neutral',
        'Agree',
        'Strongly agree'
    ];

    eC.texts = {

        mainText: 'How strongly do you agree or disagree with the following statements?'
    };

    // ## Dependencies

    eC.dependencies = {};

    /**
     * ## eC constructor
     *
     * Creates a new instance of eC
     *
     * @param {object} options Optional. Configuration options
     * which is forwarded to eC.init.
     *
     * @see eC.init
     */
    function eC() {

        /**
         * ## eC.eC
         *
         * The ChoiceTableGroup widget containing the items
         */
        this.eC = null;

        /**
         * ## eC.scale
         *
         * The scale used to measure eC
         *
         * Available methods: eC16, eC7, eC7s (default).
         *
         * References:
         *
         * eC7
         * Ho et al. (2015). "The nature of social dominance orientation:
         * Theorizing and measuring preferences for intergroup inequality
         * using the new eC₇ scale".
         * Journal of Personality and Social Psychology. 109 (6): 1003–1028.
         *
         * eC16
         * Sidanius and Pratto (1999). Social Dominance: An Intergroup
         * Theory of Social Hierarchy and Oppression.
         * Cambridge: Cambridge University Press.
         */
        this.scale = 'eC7s';

        /**
         * ## eC.choices
         *
         * The numerical scale used
         */
        this.choices = choices;

        /**
         * ## eC.header
         *
         * The categorical scale used
         */
        this.header = header;

        /**
         * ### eC.mainText
         *
         * A text preceeding the eC scale
         */
        this.mainText = null;
    }

    // ## eC methods.

    /**
     * ### eC.init
     *
     * Initializes the widget
     *
     * @param {object} opts Optional. Configuration options.
     */
    eC.prototype.init = function(opts) {
        opts = opts || {};

        if (opts.scale) {
            if (opts.scale !== 'eC16' &&
                opts.scale !== 'eC7' && opts.scale !== 'eC7s') {

                throw new Error('eC.init: scale must be eC16, eC7, eC7s ' +
                                'or undefined. Found: ' + opts.scale);
            }

            this.scale = opts.scale;
        }

        if (opts.choices) {
            if (!J.isArray(opts.choices) || opts.choices.length < 2) {
                throw new Error('eC.init: choices must be an array ' +
                                'of length > 1 or undefined. Found: ' +
                                opts.choices);
            }
            this.choices = opts.choices;
        }

        if (opts.header) {
            if (!J.isArray(opts.header) ||
                opts.header.length !== this.choices.length) {

                throw new Error('eC.init: header must be an array ' +
                                'of length equal to the number of choices ' +
                                'or undefined. Found: ' + opts.header);
            }
            this.header = opts.header;
        }

        if (opts.mainText) {
            if ('string' !== typeof opts.mainText && opts.mainText !== false) {
                throw new Error('eC.init: mainText must be string, ' +
                                'false, or undefined. Found: ' + opts.mainText);
            }
            this.mainText = opts.mainText;
        }
    };

    eC.prototype.append = function() {
        this.eC = node.widgets.add('ChoiceTableGroup', this.panelDiv, {
            id: this.id || 'eC_choicetable',
            items: this.getItems(this.scale),
            choices: this.choices,
            mainText: (this.mainText || this.getText('mainText')),
            title: false,
            panel: false,
            requiredChoice: this.required,
            header: this.header
        });
    };

    eC.prototype.getItems = function() {
        // E.g., ID: eC7_1.
        var s = this.scale;
        return scales[s].map(function(item, idx) {
            return [ s + '_' + (idx+1), item ];
        });
    };

    eC.prototype.getValues = function(opts) {
        opts = opts || {};
        return this.eC.getValues(opts);
    };

    eC.prototype.setValues = function(opts) {
        opts = opts || {};
        return this.eC.setValues(opts);
    };

    eC.prototype.enable = function(opts) {
        return this.eC.enable(opts);
    };

    eC.prototype.disable = function(opts) {
        return this.eC.disable(opts);
    };

    eC.prototype.highlight = function(opts) {
        return this.eC.highlight(opts);
    };

    eC.prototype.unhighlight = function(opts) {
        return this.eC.unhighlight(opts);
    };

})(node);
