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
        $(".tempTypeDisplay").text(" °F");
        $("#initialTemp").attr("placeholder", "°F");
        $("#finalTemp").attr("placeholder", "°F");
    } else if($("input[id='KRadio']:checked").val() == "on"){
        tempUnits = 'K'
        $(".tempTypeDisplay").text(" °K")
        $("#initialTemp").attr("placeholder", "°K");
        $("#finalTemp").attr("placeholder", "°K");
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
$("input[id=KRadio]").click(function(){
    $(".tempTypeDisplay").text(" °K")
    $("#initialTemp").attr("placeholder", "°K");
    $("#finalTemp").attr("placeholder", "°K");
    tempUnits = 'K'
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
            initialTemp = convertToCelsius(initialTemp, tempUnits);
            finalTemp = convertToCelsius(finalTemp, tempUnits);
        } else if(tempUnits == 'K'){
            initialTemp = convertToCelsius(initialTemp, tempUnits);
            finalTemp = convertToCelsius(finalTemp, tempUnits);
        }
        let iceDiff;
        let waterDiff;
        let steamDiff;
    /* Calculate temperature variation for each phase */
        //Keep lower value as initial temp since calculation is symmetrical
        if(initialTemp > finalTemp){
            [initialTemp, finalTemp] = [finalTemp, initialTemp];
        }
        if(initialTemp < -273.15){
            $(".result").text("Error: Lower temperature is below absolute zero");
            return;
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
        if(energyUnits == 'J'){
            var hfwt = mass * 334;
            var hvwt = mass * 2257;
            var hit = iceDiff * mass * 2.09;
            var hwt = waterDiff * mass * 4.18;
            var hst = steamDiff * mass * 2.09;
            var hfwtr = (mass * 334).toFixed(2);
            var hvwtr = (mass * 2257).toFixed(2);
            var hitr = (iceDiff * mass * 2.09).toFixed(2);
            var hwtr = (waterDiff * mass * 4.18).toFixed(2);
            var hstr = (steamDiff * mass * 2.09).toFixed(2);
        } else {
            var hfwt = mass * 334 * 0.239006;
            var hvwt = mass * 2257 * 0.239006;
            var hit = iceDiff * mass * 2.09 * 0.239006;
            var hwt = waterDiff * mass * 4.18 * 0.239006;
            var hst = steamDiff * mass * 2.09 * 0.239006;
            var hfwtr = (mass * 334 * 0.239006).toFixed(2);
            var hvwtr = (mass * 2257 * 0.239006).toFixed(2);
            var hitr = (iceDiff * mass * 2.09 * 0.239006).toFixed(2);
            var hwtr = (waterDiff * mass * 4.18 * 0.239006).toFixed(2);
            var hstr = (steamDiff * mass * 2.09 * 0.239006).toFixed(2);
        }

        let energyDiff;
        let energyTotal;
        if(energyUnits == 'J'){
            energyDiff = (hit + hfwt + hwt + hvwt + hst).toFixed(2);
            energyTotal = delimitNumbers(energyDiff);
            var sh = {
                i: 2.09,
                w: 4.18,
                s: 2.09
            }
        } else{
            energyDiff = (hit + hfwt + hwt + hvwt + hst).toFixed(2);
            energyTotal = delimitNumbers(energyDiff);
            var sh = {
                i: (2.09 * 0.239006).toFixed(2),
                w: (4.18 * 0.239006).toFixed(2),
                s: (2.09 * 0.239006).toFixed(2)
            }
        }
        $(".result").html(`
            <ul style="list-style: none;">
                <div class="cmb"><strong>Energy: ${energyTotal} ${energyUnits}</strong></div>
                <div class="cmb">Min: ${initialTempr} °C, Max: ${finalTempr} °C </div>
                <div>ΔT as ice: ${iceDiffr} °C</div>
                <div>ΔT as water: ${waterDiffr} °C</div>
                <div class="cmb">ΔT as steam: ${steamDiffr} °C</div>
                <div>Step 1: ${hitr} = ${iceDiffr} · ${mass} · ${sh.i}</div>
                <div>Step 2: ${hfwtr} = ${mass} · 334</div>
                <div>Step 3: ${hwtr} = ${waterDiffr} · ${mass} · ${sh.w}</div>
                <div>Step 4: ${hvwtr} = ${mass} · 2257</div>
                <div>Step 5: ${hstr} = ${steamDiffr} · ${mass} · ${sh.s}</div>
                <div>Step 6: <strong>${energyTotal} ${energyUnits}</strong> = ${hitr} + ${hfwtr} + ${hwtr} + ${hvwtr} + ${hstr}</div>
            </ul>
        `);
    }
    catch(err){
        $(".result").text("error");
        console.log(err);
    }
}

//functions
function convertToCelsius(temp, tempUnits){
    if(tempUnits == 'F'){
        return (temp - 32) * (5 / 9);
    } else if(tempUnits == 'K'){
        return (temp - 273.15);
    }
}

function delimitNumbers(str) {
    return (str + "").replace(/\b(\d+)((\.\d+)*)\b/g, function (a, b, c) {
      return (b.charAt(0) > 0 && !(c || ".").lastIndexOf(".") ?
        b.replace(/(\d)(?=(\d{3})+$)/g, "$1,") : b) + c;
    });
  }