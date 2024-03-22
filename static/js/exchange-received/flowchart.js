document.addEventListener('DOMContentLoaded', function() {
    const nodes = [
        { id: 1, label: '*User*', color: '#FFA384', shape: 'box', x: 200, y: 150, font: { bold: true } },
        { id: 2, label: '*USDC Token*\n*Contract*', color: '#EFE7BC', shape: 'box', x: 300, y: 300, font: { bold: true } },
        { id: 3, label: '*ETH/USDC*\n*Pool*', color: '#74BDCB', shape: 'box', x: -100, y: 200, font: { bold: true } },
        { id: 4, label: '*CRV/ETH*\n*Pool*', color: '#E7F2F8', shape: 'box', fixed: { x: true, y: true }, font: { bold: true } }
    ];

    const edges = [
        { id: 1, from: 1, to: 2, label: '*Approve*', arrows: 'to', width: 3, color: '#333333' },
        { id: 2, from: 1, to: 3, label: '*1000 USDC*', arrows: 'to', width: 3, color: '#333333' },
        { id: 3, from: 3, to: 4, label: '*1 ETH*', arrows: 'to', width: 3, color: '#333333' },
        { id: 4, from: 1, to: 4, label: '*Call*\n*exchange_received*', arrows: 'to', width: 3, color: '#333333' },
        { id: 5, from: 4, to: 1, label: '*100 CRV*', arrows: 'to', width: 3, color: '#333333' }
    ];

    const subtitles = [
        '1. User approves USDC spending by the ETH/USDC pool before the trade',
        '2. User swaps 1000 USDC for 1 ETH with CRV/ETH pool as the recipient',
        '3. 1 ETH is transferred from the ETH/USDC pool to the CRV/ETH pool',
        '4. User calls exchange_received to swap the extra 1 ETH in the CRV/ETH pool to CRV',
        '5. User receives 100 CRV after calling exchange_received'
    ];

    const container = document.getElementById('graph');
    const data = {
        nodes: nodes,
        edges: []
    };

    const options = {
        nodes: {
            shape: 'box',
            font: {
                size: 20,
                color: '#444',
                multi: 'markdown',
            },
            margin: 15,
            borderWidth: 0,
            widthConstraint: {
                maximum: 200
            }
        },
        edges: {
            font: {
                size: 18,
                align: 'horizontal',
                color: "#888",
                multi: 'md',
                strokeWidth: 0
            },
            arrows: {
                to: {
                    enabled: true,
                    scaleFactor: 0.75
                }
            },
            smooth: {
                type: 'curvedCW',
                roundness: 0.5
            }
        },
        layout: {
            randomSeed: 1,
            improvedLayout: true
        },
        physics: {
            enabled: false
        },
        interaction: {
            dragNodes: true,
            dragView: true,
            zoomView: true,
            selectable: false
        }
    };

    const network = new vis.Network(container, data, options);

    // Animation
    let currentStep = 0;
    let isPlaying = false;
    const animationLoops = 3;
    let trafficTimeout;

    function showStep(step) {
        const edge = edges[step];
        const subtitle = subtitles[step];

        if (!network.body.data.edges.get(edge.id)) {
            network.body.data.edges.add(edge);
        }

        clearTimeout(trafficTimeout);

        // Animate traffic along the edge
        let loopCount = 0;
        function animateTraffic() {
            network.animateTraffic([
                {
                    edge: edge.id,
                    trafficSize: 8,
                    strokeColor: edge.color,
                    fillColor: `rgba(51, 51, 51, 0.8)`
                }
            ]);
            loopCount++;
            if (loopCount < animationLoops) {
                trafficTimeout = setTimeout(animateTraffic, 2000);
            }
        }
        animateTraffic();

        // Update subtitle
        document.getElementById('subtitle').textContent = subtitle;

        // Update step counter
        document.getElementById('stepCounter').textContent = `Step: ${step + 1}/${edges.length}`;
    }

    function nextStep() {
        if (currentStep < edges.length - 1) {
            currentStep++;
            showStep(currentStep);
        } else if (isPlaying) {
            currentStep = 0;
            network.body.data.edges.clear();
            showStep(currentStep);
        }
    }

    function prevStep() {
        if (currentStep > 0) {
            currentStep--;
            network.body.data.edges.remove(edges[currentStep + 1].id);
            showStep(currentStep);
        }
    }

    function startAnimation() {
        if (currentStep < edges.length - 1) {
            nextStep();
            setTimeout(startAnimation, animationLoops * 2000);
        } else {
            isPlaying = false;
            playIcon.style.display = 'inline';
            pauseIcon.style.display = 'none';
        }
    }

    function stopAnimation() {
        isPlaying = false;
        playIcon.style.display = 'inline';
        pauseIcon.style.display = 'none';
        clearTimeout(trafficTimeout);
    }

    const prevButton = document.getElementById('prevButton');
    const nextButton = document.getElementById('nextButton');
    const playPauseButton = document.getElementById('playPauseButton');
    const playIcon = document.getElementById('playIcon');
    const pauseIcon = document.getElementById('pauseIcon');

    prevButton.addEventListener('click', prevStep);
    nextButton.addEventListener('click', nextStep);
    playPauseButton.addEventListener('click', function() {
        if (isPlaying) {
            stopAnimation();
        } else {
            isPlaying = true;
            playIcon.style.display = 'none';
            pauseIcon.style.display = 'inline';
            if (currentStep == edges.length - 1) {

                currentStep = 0;
                network.body.data.edges.clear();
                showStep(currentStep);
                setTimeout(startAnimation, 3 * 2000);
            }
            else {
                startAnimation();
            }
        }
    });

    // Show the first step initially
    showStep(currentStep);
});