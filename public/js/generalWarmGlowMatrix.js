/**
 * # gWG
 * Copyright(c) 2021 Stefano Balietti
 * MIT Licensed
 *
 * Displays an interface to measure users' social dominance orientation (S.D.O.)
 *
 * www.nodegame.org
 */
(function(node) {

    "use strict";

    node.widgets.register('gWG', gWG);

    // ## Meta-data

    gWG.version = '0.1.0';
    gWG.description = 'gWGrix question.';

    gWG.title = 'gWG';
    gWG.className = 'gWG';


    var scales = {

        gWG7: [
            'I like to contribute money to projects that protect the environment or aim to mitigate global warming. I will rarely deny a request to contribute to such projects. ',
            'I get a good feeling from donations to good causes such as environmental projects.',
            'Spending money for a good cause is nothing special. I have an obligation to do something for others or the environment.'
        ],
    };

    scales.gWG7s = [
        scales.gWG7[0], scales.gWG7[1], scales.gWG7[2]
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

    gWG.texts = {

        mainText: 'How strongly do you agree or disagree with the following statements?'
    };

    // ## Dependencies

    gWG.dependencies = {};

    /**
     * ## gWG constructor
     *
     * Creates a new instance of gWG
     *
     * @param {object} options Optional. Configuration options
     * which is forwarded to gWG.init.
     *
     * @see gWG.init
     */
    function gWG() {

        /**
         * ## gWG.gWG
         *
         * The ChoiceTableGroup widget containing the items
         */
        this.gWG = null;

        /**
         * ## gWG.scale
         *
         * The scale used to measure gWG
         *
         * Available methods: gWG16, gWG7, gWG7s (default).
         *
         * References:
         *
         * gWG7
         * Ho et al. (2015). "The nature of social dominance orientation:
         * Theorizing and measuring preferences for intergroup inequality
         * using the new gWG₇ scale".
         * Journal of Personality and Social Psychology. 109 (6): 1003–1028.
         *
         * gWG16
         * Sidanius and Pratto (1999). Social Dominance: An Intergroup
         * Theory of Social Hierarchy and Oppression.
         * Cambridge: Cambridge University Press.
         */
        this.scale = 'gWG7s';

        /**
         * ## gWG.choices
         *
         * The numerical scale used
         */
        this.choices = choices;

        /**
         * ## gWG.header
         *
         * The categorical scale used
         */
        this.header = header;

        /**
         * ### gWG.mainText
         *
         * A text preceeding the gWG scale
         */
        this.mainText = null;
    }

    // ## gWG methods.

    /**
     * ### gWG.init
     *
     * Initializes the widget
     *
     * @param {object} opts Optional. Configuration options.
     */
    gWG.prototype.init = function(opts) {
        opts = opts || {};

        if (opts.scale) {
            if (opts.scale !== 'gWG16' &&
                opts.scale !== 'gWG7' && opts.scale !== 'gWG7s') {

                throw new Error('gWG.init: scale must be gWG16, gWG7, gWG7s ' +
                                'or undefined. Found: ' + opts.scale);
            }

            this.scale = opts.scale;
        }

        if (opts.choices) {
            if (!J.isArray(opts.choices) || opts.choices.length < 2) {
                throw new Error('gWG.init: choices must be an array ' +
                                'of length > 1 or undefined. Found: ' +
                                opts.choices);
            }
            this.choices = opts.choices;
        }

        if (opts.header) {
            if (!J.isArray(opts.header) ||
                opts.header.length !== this.choices.length) {

                throw new Error('gWG.init: header must be an array ' +
                                'of length equal to the number of choices ' +
                                'or undefined. Found: ' + opts.header);
            }
            this.header = opts.header;
        }

        if (opts.mainText) {
            if ('string' !== typeof opts.mainText && opts.mainText !== false) {
                throw new Error('gWG.init: mainText must be string, ' +
                                'false, or undefined. Found: ' + opts.mainText);
            }
            this.mainText = opts.mainText;
        }
    };

    gWG.prototype.append = function() {
        this.gWG = node.widgets.add('ChoiceTableGroup', this.panelDiv, {
            id: this.id || 'gWG_choicetable',
            items: this.getItems(this.scale),
            choices: this.choices,
            mainText: (this.mainText || this.getText('mainText')),
            title: false,
            panel: false,
            requiredChoice: this.required,
            header: this.header
        });
    };

    gWG.prototype.getItems = function() {
        // E.g., ID: gWG7_1.
        var s = this.scale;
        return scales[s].map(function(item, idx) {
            return [ s + '_' + (idx+1), item ];
        });
    };

    gWG.prototype.getValues = function(opts) {
        opts = opts || {};
        return this.gWG.getValues(opts);
    };

    gWG.prototype.setValues = function(opts) {
        opts = opts || {};
        return this.gWG.setValues(opts);
    };

    gWG.prototype.enable = function(opts) {
        return this.gWG.enable(opts);
    };

    gWG.prototype.disable = function(opts) {
        return this.gWG.disable(opts);
    };

    gWG.prototype.highlight = function(opts) {
        return this.gWG.highlight(opts);
    };

    gWG.prototype.unhighlight = function(opts) {
        return this.gWG.unhighlight(opts);
    };

})(node);
