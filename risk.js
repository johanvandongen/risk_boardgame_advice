//Make bar chart
var ctx = document.getElementById('myChart').getContext('2d');
var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: [['win 2', 'armies'], 'quitte', ['lose 2', "armies"], '', ['win 1', "army"], ['lose 1', "army"]], //empy bar to add space
        datasets: [{
            label: 'chance of happening(%)',
            data: [12/36*100, 8/36*100, 16/36*100, 0, 2/36*100, 5/36*100],
            backgroundColor: [
                'rgba(75, 192, 192, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(255, 99, 132, 1)',

                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(255, 99, 132, 1)',
            ],
            borderColor: [
                'rgba(75, 192, 192, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(255, 99, 132, 1)',

                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(255, 99, 132, 1)',
            ],
            borderWidth: 1
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: true,
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    // Include a dollar sign in the ticks
                    callback: function(value, index, ticks) {
                        return value + "%";
                    },
                    font: {
                        size: 20
                    }
                }
            },
            x: {
                ticks: {
                    font: {
                        size: 18
                    }
                }
            }      
        },
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: true,
                text: 'Chance of each outcome (%)',
                color: 'rgba(0, 0, 0, 1)',
            },
        }
    }
});


//Execute when submit button on page is pressed
function submit() {
    var attack1 = document.getElementsByName('attack1');
    var attack2 = document.getElementsByName('attack2');
      
    for(i = 0; i < attack1.length; i++) { //Store selected value in input if radiobutton is selected
        if (attack1[i].checked) {
            var input1 = attack1[i].value;
        }
        if (attack2[i].checked) {
            var input2 = attack2[i].value;
        }
    }
    
    var win2P = win2(input1, input2)
    var lose2P = lose2(input1, input2)
    var quiteP = quite(input1, input2)
    var win1 = one_dice(input1, input2)[0]
    var lose1 = one_dice(input1, input2)[1]

    text(win2P, lose2P, win1, lose1)

    //Change data for bar chart according to new input values
    var data = [win2P/36*100, quiteP/36*100, lose2P/36*100, 0, win1/6*100, lose1/6*100].map(v => v.toFixed(1))
    myChart.data.datasets[0].data = data;
    myChart.update();
}

// Write text to screen
function text(win2P, lose2P, win1, lose1) {
    document.getElementById("val1").innerHTML = (win1/6 + lose1/6*-1).toFixed(2) + " armies";
    document.getElementById("val2").innerHTML = (win2P/36*2 + lose2P/36*-2).toFixed(2) + " armies";
    
    var recom = document.getElementById("recommendation");
    if ((win2P/36*2 + lose2P/36*-2) > (win1/6 + lose1/6*-1)) {
        recom.innerHTML = "2 dices!"
    } else {
        recom.innerHTML = "1 dice!"
    }
}


// Logic for counting the nr. of possibilities for each outcome
// 2 dices:  win 2 armies / lose 2 armies / draw 
// 1 dice:   win 1 army / lose 1 army

// Return the amount of possibilities to win/lose 0-6
function one_dice(input1, input2) {
    if (input1 > input2) {
        var max = input1;
    } else {
        var max = input2;
    }
    count  = 6-max+1;
    return [count, 6-count];
}
// Return the amount of possibilities to win2 1-36
function win2(input1, input2) {
    set1 = [], set2 = []
    for (let i = 6; i>=input1; i--) {
        set1.push(i)
    }
    for (let i = 6; i>=input2; i--) {
        set2.push(i)
    }
    return count_possibilities(set1, set2)
}

// 36 (total possibilities) - win2 (win possibilities) - lose2 (lose possibilities) = draw
function quite(input1, input2) {
    return 36 - win2(input1, input2) - lose2(input1, input2)
}
// Return the amount of possibilities to lose2 0-36
function lose2(input1, input2) {
    set1 = [], set2 = []
    for (let i = 1; i<input1; i++) {
        set1.push(i)
    }
    for (let i = 1; i<input2; i++) {
        set2.push(i)
    }
    return count_possibilities(set1, set2)
}

// Input two sets 
// Return nr. of distinct pairs
// Idea -- S1*S2 + S2-S1 *S1 (where S2 is the larger set)
function count_possibilities(set1, set2) {
    // Make set2 largest
    if (set1.length > set2.length) { // If set1 is larger, swap set1 and set2
        var temp = set1              // If set2 is larger than keep set1 & set2 as is
        set1 = set2
        set2 = temp
    }
    // S1 * S2
    let sum = set1.length*set2.length; //mutiply set sizes to get the number of possabilities

    // S2-S1
    for (let i = 0; i<set1.length; i++) {
        if (set2.includes(set1[i])){
            const index = set2.indexOf(set1[i]);
            set2.splice(index, 1);
        }
    }
    sum += set1.length*set2.length;
    return sum; // 0-36
}
