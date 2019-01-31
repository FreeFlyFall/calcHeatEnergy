var energyUnits = 'cal';
var tempUnits = 'C';

//check for Navigation Timing API support
if (!window.performance) {
    alert("window.performance is not available in this browser.\n Please re-select unit types if you refresh the page");
}

if (window.performance.navigation.type == 1){
    if($("input[id='JRadio']:checked").val() == "on"){
        energyUnits = 'J';
    }
    if($("input[id='FRadio']:checked").val() == "on"){
        tempUnits = 'F';
    }
}

$("button").click(function(){
    calculate();
});
$("input").keydown(function(e){
    if (e.keyCode === 13) {
      $("button").click();
    }
});

//Temp Unit radios
$("input[id=FRadio]").click(function(){
        $(".tempTypeDisplay").text(" °F");
        $("#initialTemp").attr("placeholder", "°F");
        $("#finalTemp").attr("placeholder", "°F");
        tempUnits = 'F'
});
$("input[id=CRadio]").click(function(){
    $(".tempTypeDisplay").text(" °C")
    $("#initialTemp").attr("placeholder", "°C");
    $("#finalTemp").attr("placeholder", "°C");
    tempUnits = 'C'
});
$("input[id=calRadio]").click(function(){
    energyUnits = 'cal'
});
$("input[id=JRadio]").click(function(){
    energyUnits = 'J'
});

function calculate(){
    try{
        let mass = parseFloat($('#mass').val());
        let initialTemp = parseFloat($("#initialTemp").val());
        let finalTemp = parseFloat($("#finalTemp").val());
        if(tempUnits == 'F'){
            initialTemp = convertToCelsius(initialTemp);
            finalTemp = convertToCelsius(finalTemp);
        }

        let iceDiff;
        let waterDiff;
        let steamDiff;
    /* Calculate temperature variation for each phase */
        //Keep lower value as initial temp since calculation is symmetrical
        if(initialTemp > finalTemp){
            [initialTemp, finalTemp] = [finalTemp, initialTemp];
        }
        // calculate heat change per phase
        if(initialTemp < 0 && finalTemp < 0){
            iceDiff = finalTemp - initialTemp;
        } else if(initialTemp < 0){
            iceDiff = -initialTemp;
        } else{
            iceDiff = 0;
        }
        if(finalTemp <= 100){
            if(initialTemp > 0){
                waterDiff = finalTemp - initialTemp;
            } else {
                waterDiff = finalTemp;
            }
            steamDiff = 0
        }
        if(finalTemp > 100){
            if(initialTemp > 100){
                waterDiff = 0;
                steamDiff  = finalTemp - initialTemp
                }
            else if(initialTemp > 0){
                waterDiff = 100 - initialTemp;
            } else{
                waterDiff = 100;
            }
            if (initialTemp < 100){
                steamDiff = finalTemp - 100;
            }
        }
        if(finalTemp < 0){
            waterDiff = 0;
        }

        // Round to 2 places for display
        let initialTempr = initialTemp.toFixed(2);
        let finalTempr = finalTemp.toFixed(2);
        let iceDiffr = iceDiff.toFixed(2);
        let waterDiffr = waterDiff.toFixed(2);
        let steamDiffr = steamDiff.toFixed(2);

        // Display temp changes per phase
        console.log(`Min: ${initialTempr} °C, Max: ${finalTempr} °C \n\nChange as ice: ${iceDiffr} °C \nChange as water: ${waterDiffr} °C \nChange as steam: ${steamDiffr} °C`);

        if(energyUnits == 'J'){
            energyDiff = getEnergyDiff(mass, iceDiff, waterDiff, steamDiff).toFixed(2);
            display = delimitNumbers(energyDiff);
        } else{
            energyDiff = (getEnergyDiff(mass, iceDiff, waterDiff, steamDiff) / 0.239006).toFixed(2);
            display = delimitNumbers(energyDiff);
        }
        $(".result").html(`<div>Energy: ${display} ${energyUnits}</div><br /><div>Min: ${initialTempr} °C, Max: ${finalTempr} °C </div><br /><div>Change as ice: ${iceDiffr} °C</div><div>Change as water: ${waterDiffr} °C</div><div>Change as steam: ${steamDiffr} °C</div>`);
    }
    catch(err){
        $(".result").text("error");
        console.log(err);
    }
}

//functions
function convertToCelsius(temp){
    return (temp - 32) * (5 / 9);
}

function getEnergyDiff(mass, iceDiff, waterDiff, steamDiff){
    return mass * 334 + mass * 2257 + (iceDiff * mass * 2.09) + (waterDiff * mass * 4.18) + (steamDiff * mass * 2.09);
}

function delimitNumbers(str) {
    return (str + "").replace(/\b(\d+)((\.\d+)*)\b/g, function (a, b, c) {
      return (b.charAt(0) > 0 && !(c || ".").lastIndexOf(".") ?
        b.replace(/(\d)(?=(\d{3})+$)/g, "$1,") : b) + c;
    });
  }