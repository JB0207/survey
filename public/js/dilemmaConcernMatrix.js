/**
 * # dC
 * Copyright(c) 2021 Stefano Balietti
 * MIT Licensed
 *
 * Displays an interface to measure users' social dominance orientation (S.D.O.)
 *
 * www.nodegame.org
 */
(function(node) {

    "use strict";

    node.widgets.register('dC', dC);

    // ## Meta-data

    dC.version = '0.1.0';
    dC.description = 'dCrix question.';

    dC.title = 'dC';
    dC.className = 'dC';


    var scales = {

        dC7: [
            'If I individually do something for environmental protection, it changes nothing at all in the aggregate.',
            'If others do not take part, I also will not engage in environmental protection.',
            'If I protect the environment, I am a "sucker" because I still suffer as a consequence of the environmentally damaging behavior of others.',
            'Since others do enough for environmental protection, I do not have to contribute.'
        ],
    };

    scales.dC7s = [
        scales.dC7[0], scales.dC7[1], scales.dC7[2], scales.dC7[3]
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

    dC.texts = {

        mainText: 'How strongly do you agree or disagree with the following statements?'
    };

    // ## Dependencies

    dC.dependencies = {};

    /**
     * ## dC constructor
     *
     * Creates a new instance of dC
     *
     * @param {object} options Optional. Configuration options
     * which is forwarded to dC.init.
     *
     * @see dC.init
     */
    function dC() {

        /**
         * ## dC.dC
         *
         * The ChoiceTableGroup widget containing the items
         */
        this.dC = null;

        /**
         * ## dC.scale
         *
         * The scale used to measure dC
         *
         * Available methods: dC16, dC7, dC7s (default).
         *
         * References:
         *
         * dC7
         * Ho et al. (2015). "The nature of social dominance orientation:
         * Theorizing and measuring preferences for intergroup inequality
         * using the new dC₇ scale".
         * Journal of Personality and Social Psychology. 109 (6): 1003–1028.
         *
         * dC16
         * Sidanius and Pratto (1999). Social Dominance: An Intergroup
         * Theory of Social Hierarchy and Oppression.
         * Cambridge: Cambridge University Press.
         */
        this.scale = 'dC7s';

        /**
         * ## dC.choices
         *
         * The numerical scale used
         */
        this.choices = choices;

        /**
         * ## dC.header
         *
         * The categorical scale used
         */
        this.header = header;

        /**
         * ### dC.mainText
         *
         * A text preceeding the dC scale
         */
        this.mainText = null;
    }

    // ## dC methods.

    /**
     * ### dC.init
     *
     * Initializes the widget
     *
     * @param {object} opts Optional. Configuration options.
     */
    dC.prototype.init = function(opts) {
        opts = opts || {};

        if (opts.scale) {
            if (opts.scale !== 'dC16' &&
                opts.scale !== 'dC7' && opts.scale !== 'dC7s') {

                throw new Error('dC.init: scale must be dC16, dC7, dC7s ' +
                                'or undefined. Found: ' + opts.scale);
            }

            this.scale = opts.scale;
        }

        if (opts.choices) {
            if (!J.isArray(opts.choices) || opts.choices.length < 2) {
                throw new Error('dC.init: choices must be an array ' +
                                'of length > 1 or undefined. Found: ' +
                                opts.choices);
            }
            this.choices = opts.choices;
        }

        if (opts.header) {
            if (!J.isArray(opts.header) ||
                opts.header.length !== this.choices.length) {

                throw new Error('dC.init: header must be an array ' +
                                'of length equal to the number of choices ' +
                                'or undefined. Found: ' + opts.header);
            }
            this.header = opts.header;
        }

        if (opts.mainText) {
            if ('string' !== typeof opts.mainText && opts.mainText !== false) {
                throw new Error('dC.init: mainText must be string, ' +
                                'false, or undefined. Found: ' + opts.mainText);
            }
            this.mainText = opts.mainText;
        }
    };

    dC.prototype.append = function() {
        this.dC = node.widgets.add('ChoiceTableGroup', this.panelDiv, {
            id: this.id || 'dC_choicetable',
            items: this.getItems(this.scale),
            choices: this.choices,
            mainText: (this.mainText || this.getText('mainText')),
            title: false,
            panel: false,
            requiredChoice: this.required,
            header: this.header
        });
    };

    dC.prototype.getItems = function() {
        // E.g., ID: dC7_1.
        var s = this.scale;
        return scales[s].map(function(item, idx) {
            return [ s + '_' + (idx+1), item ];
        });
    };

    dC.prototype.getValues = function(opts) {
        opts = opts || {};
        return this.dC.getValues(opts);
    };

    dC.prototype.setValues = function(opts) {
        opts = opts || {};
        return this.dC.setValues(opts);
    };

    dC.prototype.enable = function(opts) {
        return this.dC.enable(opts);
    };

    dC.prototype.disable = function(opts) {
        return this.dC.disable(opts);
    };

    dC.prototype.highlight = function(opts) {
        return this.dC.highlight(opts);
    };

    dC.prototype.unhighlight = function(opts) {
        return this.dC.unhighlight(opts);
    };

})(node);
