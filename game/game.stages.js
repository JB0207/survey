/**
 * # Game stages definition file
 * Copyright(c) 2021 Stefano Balietti <ste@nodegame.org>
 * MIT Licensed
 *
 * Stages are defined using the stager API
 *
 * http://www.nodegame.org
 * ---
 */

module.exports = function(treatmentName, settings, stager, setup, gameRoom) {

     stager
        .next('consent')
        .next('instructions')
        .next('questionInformation-1')
        .next('demographics')
        .next('questionInformation-2')
        .next('dilemmaConcernMatrix')
        .next('trust')
        .next('subjectiveNorm')
        .next('perceivedBehavioralControl')
        .next('awarenessOfNeedForPaying')
        .next('awarenessOfResponsibilityForPaying')
        .next('environmentalConcernMatrix')
        .next('generalWarmGlowMatrix')
        .next('subjectiveObligationToPay')
        .next('treatment')
        .next('inPrincipleWTP')
        .next('theoreticalWTP')
        .next('betterplace')
        .next('end')
        .gameover();

    // Notice: here all stages have one step named after the stage.

    // Skip one stage.
    if(treatmentName == 'TWTP'){ 
        stager.skip('betterplace');
    }
    else{
        stager.skip('theoreticalWTP')
    }


    // Skip multiple stages:
 // stager.skip(['instructions',
 //'questionInformation-1',
 //'demographics',
 //'questionInformation-2',
 //'dilemmaConcernMatrix',
 //'trust',
 //'subjectiveNorm',
 //'perceivedBehavioralControl',
 //'awarenessOfNeedForPaying',
 //'awarenessOfResponsibilityForPaying',
 //'environmentalConcernMatrix',
 //'generalWarmGlowMatrix'])

    // Skip a step within a stage:
    // stager.skip('stageName', 'stepName');

};
