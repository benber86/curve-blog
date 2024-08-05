const survivalData = {'ethereum': {'DAO': {'Stop': 0.10952380952380952, '1 or more': 0.8904761904761904, '2 or more': 0.7428571428571429, '3 or more': 0.6857142857142857, '4 or more': 0.6333333333333333, '5 or more': 0.5761904761904761, '6 or more': 0.5380952380952381, '7 or more': 0.4857142857142857, '8 or more': 0.4666666666666667, '9 or more': 0.4523809523809524, '10 or more': 0.3904761904761905}, 'LP': {'Stop': 0.4017404276479363, '1 or more': 0.5982595723520636, '2 or more': 0.2966185977125808, '3 or more': 0.1724515166583789, '4 or more': 0.11193436101442068, '5 or more': 0.0807061163600199, '6 or more': 0.061113873694679265, '7 or more': 0.04917951268025858, '8 or more': 0.040924912978617604, '9 or more': 0.035405271009448035, '10 or more': 0.03137742416708105}, 'Lending': {'Stop': 0.2781954887218045, '1 or more': 0.7218045112781954, '2 or more': 0.39849624060150374, '3 or more': 0.2631578947368421, '4 or more': 0.22556390977443608, '5 or more': 0.16541353383458646, '6 or more': 0.12781954887218044, '7 or more': 0.12030075187969924, '8 or more': 0.10526315789473684, '9 or more': 0.10526315789473684, '10 or more': 0.07518796992481203}, 'Trading': {'Stop': 0.4618345695239884, '1 or more': 0.5381654304760116, '2 or more': 0.3253215660501361, '3 or more': 0.20392451413012863, '4 or more': 0.13449441367007792, '5 or more': 0.0937001220542672, '6 or more': 0.06924232466435076, '7 or more': 0.051873063562106844, '8 or more': 0.0422964979814102, '9 or more': 0.03638156041686227, '10 or more': 0.03206271711576378}, 'UI Router': {'Stop': 0.57715964380795, '1 or more': 0.42284035619204996, '2 or more': 0.26090149637381804, '3 or more': 0.17791242082071054, '4 or more': 0.12696226934728724, '5 or more': 0.09565776186541816, '6 or more': 0.07527770127604884, '7 or more': 0.06136968695492518, '8 or more': 0.05191407325805563, '9 or more': 0.043743688607362524, '10 or more': 0.037501147525934087}, 'crvUSD': {'Stop': 0.16172506738544473, '1 or more': 0.8382749326145552, '2 or more': 0.6765498652291105, '3 or more': 0.5882749326145552, '4 or more': 0.5141509433962265, '5 or more': 0.45215633423180596, '6 or more': 0.4029649595687331, '7 or more': 0.3605121293800539, '8 or more': 0.3194070080862534, '9 or more': 0.29043126684636117, '10 or more': 0.2641509433962264}}, 'polygon': {'LP': {'Stop': 0.6443768996960486, '1 or more': 0.3556231003039514, '2 or more': 0.1702127659574468, '3 or more': 0.11077338736913205, '4 or more': 0.08375548801080716, '5 or more': 0.07159743329956096, '6 or more': 0.060790273556231005, '7 or more': 0.050996285038838234, '8 or more': 0.04660587639311044, '9 or more': 0.04154002026342452, '10 or more': 0.037149611617696726}, 'Trading': {'Stop': 0.8128855380397533, '1 or more': 0.18711446196024675, '2 or more': 0.15901302261823166, '3 or more': 0.13708019191226867, '4 or more': 0.12679917751884853, '5 or more': 0.11925976696367376, '6 or more': 0.10486634681288554, '7 or more': 0.09869773817683344, '8 or more': 0.09252912954078135, '9 or more': 0.08636052090472926, '10 or more': 0.08087731322823852}, 'UI Router': {'Stop': 0.6414870769458639, '1 or more': 0.3585129230541361, '2 or more': 0.11604828556617049, '3 or more': 0.04169443827297638, '4 or more': 0.01918092275790565, '5 or more': 0.012886025327704954, '6 or more': 0.009257202103236318, '7 or more': 0.007776049766718507, '8 or more': 0.005924609346071244, '9 or more': 0.0052580907946382285, '10 or more': 0.004295341775901651}}, 'arbitrum': {'LP': {'Stop': 0.39646464646464646, '1 or more': 0.6035353535353535, '2 or more': 0.4025252525252525, '3 or more': 0.3116161616161616, '4 or more': 0.25555555555555554, '5 or more': 0.22095959595959597, '6 or more': 0.19267676767676767, '7 or more': 0.17020202020202022, '8 or more': 0.151010101010101, '9 or more': 0.13535353535353536, '10 or more': 0.12323232323232323}, 'Lending': {'Stop': 0.09567901234567901, '1 or more': 0.904320987654321, '2 or more': 0.7592592592592593, '3 or more': 0.6327160493827161, '4 or more': 0.5092592592592593, '5 or more': 0.4537037037037037, '6 or more': 0.39197530864197533, '7 or more': 0.35802469135802467, '8 or more': 0.3055555555555556, '9 or more': 0.2777777777777778, '10 or more': 0.25308641975308643}, 'Trading': {'Stop': 0.7036088474970896, '1 or more': 0.29639115250291037, '2 or more': 0.17764842840512224, '3 or more': 0.12828870779976717, '4 or more': 0.10593713620488941, '5 or more': 0.09126891734575088, '6 or more': 0.08125727590221188, '7 or more': 0.07287543655413271, '8 or more': 0.0679860302677532, '9 or more': 0.06356228172293364, '10 or more': 0.06053550640279395}, 'UI Router': {'Stop': 0.6066985645933014, '1 or more': 0.39330143540669854, '2 or more': 0.20966507177033492, '3 or more': 0.1445933014354067, '4 or more': 0.10976076555023924, '5 or more': 0.08880382775119618, '6 or more': 0.07148325358851675, '7 or more': 0.05913875598086124, '8 or more': 0.05148325358851675, '9 or more': 0.04555023923444976, '10 or more': 0.04009569377990431}}, 'optimism': {'LP': {'Stop': 0.6146964856230032, '1 or more': 0.3853035143769968, '2 or more': 0.21214057507987222, '3 or more': 0.1463258785942492, '4 or more': 0.11309904153354633, '5 or more': 0.09201277955271565, '6 or more': 0.07859424920127796, '7 or more': 0.0670926517571885, '8 or more': 0.05623003194888179, '9 or more': 0.04984025559105431, '10 or more': 0.04472843450479233}, 'Trading': {'Stop': 0.4001336005344021, '1 or more': 0.5998663994655978, '2 or more': 0.3800935203740815, '3 or more': 0.21710086840347362, '4 or more': 0.13026052104208416, '5 or more': 0.09619238476953908, '6 or more': 0.07615230460921844, '7 or more': 0.06880427521710086, '8 or more': 0.0614562458249833, '9 or more': 0.058784235136940546, '10 or more': 0.05811623246492986}, 'UI Router': {'Stop': 0.6652955185105001, '1 or more': 0.3347044814894999, '2 or more': 0.11604243342714873, '3 or more': 0.07295951504654687, '4 or more': 0.04806235115825936, '5 or more': 0.03615501190733925, '6 or more': 0.028794111279497728, '7 or more': 0.023814678501840224, '8 or more': 0.01970123403334055, '9 or more': 0.014721801255683049, '10 or more': 0.013206321714656853}}, 'base': {'LP': {'Stop': 0.45285524568393093, '1 or more': 0.547144754316069, '2 or more': 0.21115537848605578, '3 or more': 0.14143426294820718, '4 or more': 0.09827357237715803, '5 or more': 0.07304116865869854, '6 or more': 0.061752988047808766, '7 or more': 0.05245683930942895, '8 or more': 0.04648074369189907, '9 or more': 0.03851261620185923, '10 or more': 0.033200531208499334}, 'Trading': {'Stop': 0.2403846153846154, '1 or more': 0.7596153846153846, '2 or more': 0.6923076923076923, '3 or more': 0.6474358974358975, '4 or more': 0.532051282051282, '5 or more': 0.47115384615384615, '6 or more': 0.38782051282051283, '7 or more': 0.33974358974358976, '8 or more': 0.3333333333333333, '9 or more': 0.32371794871794873, '10 or more': 0.3141025641025641}, 'UI Router': {'Stop': 0.646822278715045, '1 or more': 0.35317772128495495, '2 or more': 0.12239426854633695, '3 or more': 0.05870117864571296, '4 or more': 0.030922116940143286, '5 or more': 0.021076958631846544, '6 or more': 0.01469840536168246, '7 or more': 0.012017564132193206, '8 or more': 0.00956782990524613, '9 or more': 0.008134966489484632, '10 or more': 0.006655881673214698}}, 'fantom': {'LP': {'Stop': 0.5870445344129555, '1 or more': 0.41295546558704455, '2 or more': 0.291497975708502, '3 or more': 0.21052631578947367, '4 or more': 0.17813765182186234, '5 or more': 0.15789473684210525, '6 or more': 0.13765182186234817, '7 or more': 0.12955465587044535, '8 or more': 0.10931174089068826, '9 or more': 0.10931174089068826, '10 or more': 0.10526315789473684}, 'Trading': {'Stop': 0.7297921478060047, '1 or more': 0.2702078521939954, '2 or more': 0.22632794457274827, '3 or more': 0.18937644341801385, '4 or more': 0.18244803695150116, '5 or more': 0.17321016166281755, '6 or more': 0.16166281755196305, '7 or more': 0.15473441108545036, '8 or more': 0.15242494226327943, '9 or more': 0.14780600461893764, '10 or more': 0.14318706697459585}, 'UI Router': {'Stop': 0.5497237569060773, '1 or more': 0.45027624309392267, '2 or more': 0.24585635359116023, '3 or more': 0.1574585635359116, '4 or more': 0.1132596685082873, '5 or more': 0.09668508287292818, '6 or more': 0.0718232044198895, '7 or more': 0.058011049723756904, '8 or more': 0.052486187845303865, '9 or more': 0.03867403314917127, '10 or more': 0.024861878453038673}}, 'fraxtal': {'LP': {'Stop': 0.3161290322580645, '1 or more': 0.6838709677419355, '2 or more': 0.5096774193548387, '3 or more': 0.4, '4 or more': 0.36129032258064514, '5 or more': 0.3161290322580645, '6 or more': 0.2709677419354839, '7 or more': 0.21935483870967742, '8 or more': 0.1870967741935484, '9 or more': 0.15483870967741936, '10 or more': 0.14838709677419354}, 'Trading': {'Stop': 0.2391304347826087, '1 or more': 0.7608695652173914, '2 or more': 0.5434782608695652, '3 or more': 0.5, '4 or more': 0.43478260869565216, '5 or more': 0.41304347826086957, '6 or more': 0.3695652173913043, '7 or more': 0.3695652173913043, '8 or more': 0.3695652173913043, '9 or more': 0.30434782608695654, '10 or more': 0.30434782608695654}, 'UI Router': {'Stop': 0.24495677233429394, '1 or more': 0.7550432276657061, '2 or more': 0.579250720461095, '3 or more': 0.47262247838616717, '4 or more': 0.3919308357348703, '5 or more': 0.3515850144092219, '6 or more': 0.2968299711815562, '7 or more': 0.26512968299711814, '8 or more': 0.2564841498559078, '9 or more': 0.23631123919308358, '10 or more': 0.2132564841498559}}, 'xdai': {'LP': {'Stop': 0.40404040404040403, '1 or more': 0.5959595959595959, '2 or more': 0.36363636363636365, '3 or more': 0.26262626262626265, '4 or more': 0.24242424242424243, '5 or more': 0.21212121212121213, '6 or more': 0.1717171717171717, '7 or more': 0.15151515151515152, '8 or more': 0.15151515151515152, '9 or more': 0.1414141414141414, '10 or more': 0.1414141414141414}, 'Trading': {'Stop': 0.7898423817863398, '1 or more': 0.21015761821366025, '2 or more': 0.1243432574430823, '3 or more': 0.09632224168126094, '4 or more': 0.07530647985989491, '5 or more': 0.06129597197898424, '6 or more': 0.0595446584938704, '7 or more': 0.0542907180385289, '8 or more': 0.050788091068301226, '9 or more': 0.047285464098073555, '10 or more': 0.047285464098073555}, 'UI Router': {'Stop': 0.4292682926829268, '1 or more': 0.5707317073170731, '2 or more': 0.2975609756097561, '3 or more': 0.2146341463414634, '4 or more': 0.15121951219512195, '5 or more': 0.12682926829268293, '6 or more': 0.11219512195121951, '7 or more': 0.0975609756097561, '8 or more': 0.08780487804878048, '9 or more': 0.08292682926829269, '10 or more': 0.06829268292682927}}, 'all': {'DAO': {'Stop': 0.103627, '1 or more': 0.896373, '2 or more': 0.751295, '3 or more': 0.699482, '4 or more': 0.65285, '5 or more': 0.595855, '6 or more': 0.554404, '7 or more': 0.512953, '8 or more': 0.492228, '9 or more': 0.471503, '10 or more': 0.414508}, 'LP': {'Stop': 0.427534, '1 or more': 0.572466, '2 or more': 0.301248, '3 or more': 0.190892, '4 or more': 0.134781, '5 or more': 0.104751, '6 or more': 0.084485, '7 or more': 0.072113, '8 or more': 0.062808, '9 or more': 0.055548, '10 or more': 0.050049}, 'Lending': {'Stop': 0.163102, '1 or more': 0.836898, '2 or more': 0.625668, '3 or more': 0.508021, '4 or more': 0.411765, '5 or more': 0.34492, '6 or more': 0.294118, '7 or more': 0.280749, '8 or more': 0.235294, '9 or more': 0.216578, '10 or more': 0.195187}, 'Trading': {'Stop': 0.507281, '1 or more': 0.492719, '2 or more': 0.311577, '3 or more': 0.203911, '4 or more': 0.140946, '5 or more': 0.103405, '6 or more': 0.079693, '7 or more': 0.064082, '8 or more': 0.055771, '9 or more': 0.050044, '10 or more': 0.045713}, 'UI Router': {'Stop': 0.522919, '1 or more': 0.477081, '2 or more': 0.2648, '3 or more': 0.159582, '4 or more': 0.100709, '5 or more': 0.069622, '6 or more': 0.052339, '7 or more': 0.042048, '8 or more': 0.035465, '9 or more': 0.030205, '10 or more': 0.025941}, 'crvUSD': {'Stop': 0.159075, '1 or more': 0.840925, '2 or more': 0.67981, '3 or more': 0.594154, '4 or more': 0.521414, '5 or more': 0.459551, '6 or more': 0.412644, '7 or more': 0.371176, '8 or more': 0.332427, '9 or more': 0.301156, '10 or more': 0.275323}}};

function createSurvivalChart(chain) {

    let bgColors = [
        'rgb(255, 159, 164)',  // Stronger pastel red
        'rgb(255, 204, 153)',  // Stronger pastel orange
        'rgb(255, 233, 127)',  // Darker pastel yellow
        'rgb(127, 233, 127)',  // Darker pastel green
        'rgb(153, 204, 255)',  // Stronger pastel blue
        'rgb(204, 153, 255)'   // Stronger pastel purple
    ];


    const canvas = document.getElementById('survivalChart');
    if (!canvas) {
        console.error('Canvas with id "survivalChart" not found');
        return null;
    }

    const ctx = canvas.getContext('2d');
    const chainData = survivalData[chain];

    const datasets = Object.keys(chainData).map((product, index) => {
        return {
            label: product,
            data: Object.entries(chainData[product]).map(([key, value]) => ({x: key, y: value * 100})),
            borderColor: bgColors[index],
            backgroundColor: bgColors[index],
            fill: false,
            tension: 0.2
        };
    });

    if (survivalChart && typeof survivalChart.destroy === 'function') {
        survivalChart.destroy();
    }

    survivalChart = new Chart(ctx, {
        type: 'line',
        data: {
            datasets: datasets
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: `"Survival" rates per starting product - ${chain.charAt(0).toUpperCase() + chain.slice(1)}`
                },
                tooltip: {
                    mode: 'index',
                    intersect: false
                }
            },
            scales: {
                x: {
                    type: 'category',
                    title: {
                        display: true,
                        text: 'Number of Transactions'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Probability'
                    },
                    min: 0,
                    max: 100
                }
            }
        }
    });
}

function initSurvivalChart() {
    if (typeof createChainSelector !== 'function') {
        console.error('createChainSelector function not found. Make sure chainlist.js is loaded.');
        return;
    }

    const initialChain = createChainSelector('survivalChainSelector', (selectedChain) => {
        createSurvivalChart(selectedChain);
    });

    if (initialChain) {
        createSurvivalChart(initialChain);
    } else {
        console.error('Failed to get initial chain');
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSurvivalChart);
} else {
    initSurvivalChart();
}