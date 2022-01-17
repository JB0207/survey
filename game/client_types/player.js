
/**
 * # Player type implementation of the game stages
 * Copyright(c) 2021 Stefano Balietti <ste@nodegame.org>
 * MIT Licensed
 *
 * Each client type must extend / implement the stages defined in `game.stages`.
 * Upon connection each client is assigned a client type and it is automatically
 * setup with it.
 *
 * http://www.nodegame.org
 * ---
 */

"use strict";

const ngc = require('nodegame-client');
const J = ngc.JSUS;

module.exports = function (treatmentName, settings, stager, setup, gameRoom) {

    // Define a function for future use.
    function capitalizeInput(input) {
        var str;
        str = input.value;
        str = str.charAt(0).toUpperCase() + str.substr(1).toLowerCase();
        input.value = str;
    }

    // Make the player step through the steps without waiting for other players.
    stager.setDefaultStepRule(ngc.stepRules.SOLO);

    stager.setOnInit(function () {

        // Initialize the client.

        var header;

        // Setup page: header + frame.
        header = W.generateHeader();
        W.generateFrame();

        // Add widgets.
        this.visuaStage = node.widgets.append('VisualStage', header);
        this.visualRound = node.widgets.append('VisualRound', header);

        this.discBox = node.widgets.append('DisconnectBox', header, {
            disconnectCb: function () {
                var str;
                W.init({ waitScreen: true });
                str = 'Disconnection detected. Please refresh to reconnect.';
                node.game.pause(str);
                alert(str);
            },
            connectCb: function () {
                // If the user refresh the page, this is not called, it
                // is a normal (re)connect.
                if (node.game.isPaused()) node.game.resume();
            }
        });


        this.doneButton = node.widgets.append('DoneButton', header, {
            text: 'Next'
        });

        this.backButton = node.widgets.append('BackButton', header, {
            acrossStages: true,
            className: 'btn btn-secondary'
        });
        this.backButton.button.style['margin-top'] = '6px';

        // No need to show the wait for other players screen in single-player
        // games.
        W.init({ waitScreen: false });

        // Additional debug information while developing the game.
        // this.debugInfo = node.widgets.append('DebugInfo', header)
    });


    stager.extendStep('consent', {
        donebutton: false,
        widget: 'Consent',
        cb: function () {
            node.on('CONSENT_REJECTING', function () {
                this.discBox.destroy();
            });
        }
        // Takes settings.CONSENT by default.
    });

    stager.extendStep('instructions', {
        // Do not go back to consent.
        backbutton: false,
        // No need to specify the frame, if named after the step id.
        // frame: 'instructions.htm',
        cb: function () {
            var s;
            // Note: we need to specify node.game.settings,
            // and not simply settings, because this code is
            // executed on the client.
            s = node.game.settings;
            // Replace variables in the instructions.
            W.setInnerHTML('coins', s.COINS);
            W.setInnerHTML('time', s.CONSENT.EXP_TIME);
        }
    });


    stager.extendStep('questionInformation-1', {
        name: 'Question Information 1',
        widget: {
            name: 'ContentBox',
            options: {
                mainText: 'On the next page, we ask you a few questions about your demographic characteristics. Please click the "Next" button.',
                className: 'centered'
            }
        }
    });


    stager.extendStep('demographics', {
        widget: {
            name: 'ChoiceManager',
            options: {
                id: 'demographics',
                mainText: '',
                simplify: true,
                forms: [
                    {
                        id: 'gender',
                        mainText: 'What is your gender?',
                        choices: ['Male', 'Female', 'Other'],
                        shuffleChoices: false,
                    },
                    {
                        name: 'CustomInput',
                        id: 'age',
                        mainText: 'What is your age?',
                        hint: '(in years)',
                        type: 'int',
                        min: 18,
                        max: 100
                        // requiredChoice: false
                    },
                    {
                        id: 'education',
                        mainText: 'What is your highest education level that you have achieved?',
                        choices: [
                            'None', 'Elementary', 'High-School', 'College',
                            'Grad School'
                        ],
                        shuffleChoices: false
                    },
                    {
                        id: 'employment',
                        mainText: 'What is your employment status?',
                        hint: '(If you have more than one of the employment statuses listed, please indicate the one for in which you spend the most time)',
                        choices: [
                            'Unemployed', 'Student', 'Employed less than part time', 'Employed-part time', 'Employed', 'Self-employed',
                            'Retired'
                        ],
                        shuffleChoices: false,
                        choicesSetSize: 4,
                    },
                    {
                        id: 'income',
                        mainText: 'What number come closest to your ' +
                            'yearly income?',
                        hint: '(in thousands of dollars)',
                        choices: [0, 5]
                            .concat(J.seq(10, 100, 10))
                            .concat(J.seq(120, 200, 20))
                            .concat(J.seq(250, 500, 50))
                            .concat(['500+']),
                        shuffleChoices: false,
                        choicesSetSize: 8
                    },

                ],
                formsOptions: {
                    requiredChoice: true,
                    shuffleChoices: true
                },
                className: 'centered'
            }
        }
    });


    stager.extendStep('questionInformation-2', {
        name: 'Question Information 2',
        widget: {
            name: 'ContentBox',
            options: {
                mainText: 'On the next pages, we ask you several questions about environmental protection and global warming.',
                className: 'centered'
            }
        }
    });


    stager.extendStep('dilemmaConcernMatrix', {
        name: 'Dilemma Concern',
        widget: {
            name: 'dC',
            title: false,
            panel: false
        }   
    });

    stager.extendStep('trust', {
        widget: {
            name: 'ChoiceManager',
            options: {
                id: 'trust',
                mainText: 'How strongly do you agree or disagree with the following statement?',
                simplify: true,
                forms: [
                    {
                        id: 'trust-1',
                        mainText: 'What do you believe: Are other people willing to pay something for environmental protection?',
                        choices: [
                            '(1) Definitely not willing to pay', '(2)', '(3)', '(4)', '(5)', '(6)',
                            '(7) Definitely willing to pay'
                        ],
                        shuffleChoices: false
                    },
                ],
                formsOptions: {
                    requiredChoice: true,
                    shuffleChoices: true
                },
                className: 'centered'
            }
        }
    });


    stager.extendStep('subjectiveNorm', {
        widget: {
            name: 'ChoiceManager',
            options: {
                id: 'subjectiveNorm',
                mainText: 'What do you think:',
                simplify: true,
                forms: [
                    {
                        id: 'subjectiveNorm-1',
                        mainText: 'Would your friends and relatives be in favor if you voluntarily contribute money to protect the environment or to mitigate global warming?',
                        choices: [
                            '(1) Would not be in favor', '(2)', '(3)', '(4) Would not care',
                            '(5)', '(6)', '(7) Would be strongly in favor'
                        ],
                        shuffleChoices: false
                    },
                ],
                formsOptions: {
                    requiredChoice: true,
                    shuffleChoices: true
                },
                className: 'centered'
            }
        }
    });


    stager.extendStep('perceivedBehavioralControl', {
        widget: {
            name: 'ChoiceManager',
            options: {
                id: 'perceivedBehavioralControl',
                mainText: 'What applies to you?',
                simplify: true,
                forms: [
                    {
                        id: 'perceivedBehavioralControl-1',
                        mainText: 'Making a financial contribution to environmental protection or to mitigate global warming is or would be for me:',
                        choices: [
                            '(1) Very difficult', '(2)', '(3)', '(4)', '(5)', '(6)',
                            '(7) Very easy'
                        ],
                        shuffleChoices: false
                    },
                    {
                        id: 'perceivedBehavioralControl-2',
                        mainText: 'Making a financial contribution to environmental protection or to mitigate global warming is or would be for me:',
                        choices: [
                            '(1) Not at all feasible', '(2)', '(3)', '(4)', '(5)', '(6)',
                            '(7) Feasible without any problems'
                        ],
                        shuffleChoices: false
                    },
                ],
                formsOptions: {
                    requiredChoice: true,
                    shuffleChoices: true
                },
                className: 'centered'
            }
        }
    });


    stager.extendStep('awarenessOfNeedForPaying', {
        widget: {
            name: 'ChoiceManager',
            options: {
                id: 'awarenessOfNeedForPaying',
                mainText: 'How strongly do you agree or disagree with the following statements?',
                simplify: true,
                forms: [
                    {
                        id: 'awarenessOfNeedForPaying-1',
                        mainText: 'Compared to other policy measures, protecting the environment and mitigating global warming are not a high priority.',
                        choices: [
                            '(1) Strongly disagree', '(2) Disagree', ' (3) Neutral', '(4) Agree',
                            '(5) Strongly agree'
                        ],
                        shuffleChoices: false
                    },
                    {
                        id: 'awarenessOfNeedForPaying-2',
                        mainText: 'The current level of environmental protection and the implemented measures against global warming are completely sufficient. From my point of view, there is not need to increase them',
                        choices: [
                            '(1) Strongly disagree', '(2) Disagree', ' (3) Neutral', '(4) Agree',
                            '(5) Strongly agree'
                        ],
                        shuffleChoices: false
                    },
                ],
                formsOptions: {
                    requiredChoice: true,
                    shuffleChoices: true
                },
                className: 'centered'
            }
        }
    });


    stager.extendStep('awarenessOfResponsibilityForPaying', {
        widget: {
            name: 'ChoiceManager',
            options: {
                id: 'awarenessOfResponsibilityForPaying',
                mainText: 'How strongly do you agree or disagree with the following statement?',
                simplify: true,
                forms: [
                    {
                        id: 'awarenessOfResponsibilityForPaying-1',
                        mainText: 'I already pay enough for other things. I do not have to also pay for environmental protection and/or the mitigation of global warming',
                        choices: [
                            '(1) Strongly disagree', '(2) Disagree', ' (3) Neutral', '(4) Agree',
                            '(5) Strongly agree'
                        ],
                        shuffleChoices: false
                    },
                ],
                formsOptions: {
                    requiredChoice: true,
                    shuffleChoices: true
                },
                className: 'centered'
            }
        }
    });


    stager.extendStep('environmentalConcernMatrix', {
        name: 'Environmental Concern',
        widget: {
            name: 'eC',
            title: false,
            panel: false
        }   
    });


    stager.extendStep('generalWarmGlowMatrix', {
        name: 'General Warm Glow',
        widget: {
            name: 'gWG',
            title: false,
            panel: false
        }   
    });


    stager.extendStep('subjectiveObligationToPay', {
        widget: {
            name: 'ChoiceManager',
            options: {
                id: 'subjectiveObligationToPay',
                mainText: 'How strongly do you agree or disagree with the following statement?',
                simplify: true,
                forms: [
                    {
                        id: 'subjectiveObligationToPay-1',
                        mainText: 'To what extent do you perceive paying something for environmental protection or global warming mitigation as a moral obligation?',
                        choices: [
                            '(1) No moral obligation at all', '(2)', '(3)', '(4)', '(5)', '(6)',
                            '(7) A very strong moral obligation'
                        ],
                        shuffleChoices: false
                    },
                ],
                formsOptions: {
                    requiredChoice: true,
                    shuffleChoices: true
                },
                className: 'centered'
            }
        }
    });


    stager.extendStep('treatment', {
        backbutton: false,
        donebutton: {
            delayOnPlaying: '0' // it is possible to continue only after 30 seconds
        },
        frame: 'informationTreatment.html',
        widget: {
                name: 'ChoiceManager',
                options: {
                    id: 'treatment',
                    simplify: true,
                    forms: [
                        {
                            id: 'treatment-1',
                            mainText: 'According to the graph, have most countries initiated effective measures to limit global warming to 1.5 degrees?',
                            choices: [
                                'Yes', 'No'
                            ],
                            shuffleChoices: false,
                            correctChoice: 1
                        },
                        {
                            id: 'treatment-2',
                            mainText: 'According to the graph, the measures adopted by the EU so far are classified as what?',
                            choices: [
                                '1.5°C Paris Agreement compatible', 'Almost sufficient', "Insufficient", 'Highly insufficient', 'Critically insufficient'
                            ],
                            shuffleChoices: true,
                            correctChoice: 2
                        },
                    ],
                    formsOptions: {
                            shuffleChoices: true
                    },
                    className: 'centered'
                }
            }
     });


         
     stager.extendStep('inPrincipleWTP', {
        backbutton: false,
        widget: {
                name: 'ChoiceManager',
                options: {
                    id: 'inPrincipleWTP',
                    mainText: 'As the previous figure has shown, most countries (including the worlds largest CO2 emitters) in the world have taken insufficient measures to mitigate and stop global warming at the present time. However, this cannot be achieved by the actions of countries alone, an important contribution can be made by charitable organizations (such as WWF, NABU, BUND, Green Forest Fund, etc.).',
                    simplify: true,
                    forms: [
                        {
                            id: 'inPrincipleWTP-1',
                            mainText: 'In principle, would you be willing to donate money to a charitable organization for environmental protection?',
                            choices: [
                                'Yes', 'No'
                            ],
                            shuffleChoices: false
                        },
                    ],
                    formsOptions: {
                        requiredChoice: true,
                        shuffleChoices: true
                    },
                    className: 'centered'
                },
     }});
    

     stager.extendStep('theoreticalWTP', {
        widget: {
                name: 'ChoiceManager',
                options: {
                        id: 'theoreticalWTP',
                        mainText: 'Suppose you now have the chance to donate money to an organization/project of your choice that works to protect the environment and to mitigate global warming, what would be the amount you would donate?',
                forms:[
                    {
                        name: 'CustomInput',
                        id: 'theoreticalWTP-1',
                        mainText:'Please type in an amount equal or greater 1€',
                        type: 'int',
                        min: 1,
                        // requiredChoice: false
                    },
                ],
                    formsOptions: {
                        requiredChoice: true,
                        shuffleChoices: true
                    },
                    className: 'centered',
                    },
     }});


     stager.extendStep('betterplace', {
        backbutton: false,             
    });


    stager.extendStep('end', {
        widget: {
            name: 'EndScreen',
            options: {
                message: 'You have now completed successfully the survey and your data has ' +
                'been saved. You can close this page now.',
                feedback: true,
                email: false,
                exitCode: false,
                totalWin: false
            

            }
        },
        init: function () {
            node.say('end');
            node.game.doneButton.destroy();
            node.game.backButton.destroy();
        }
    });
};
