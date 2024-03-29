document.addEventListener('DOMContentLoaded', function() {
    const nodes = [
        { id: 1, label: '*User*', color: '#FFA384', shape: 'box', x: 200, y: 150, font: { bold: true } },
        { id: 2, label: '*WETH/USDC*\n*Pool*', color: '#74BDCB', shape: 'box', x: -200, y: 200, font: { bold: true } }
    ];

    const edges = [
        { id: 1, from: 1, to: 2, label: '*1000 USDC*', arrows: 'to', width: 3, color: '#333333' },
        { id: 2, from: 1, to: 2, label: '*exchange_received()*', arrows: 'to', width: 3, color: '#333333', smooth: { type: 'curvedCW', roundness: 0.2 } },
        { id: 3, from: 2, to: 1, label: '*1 WETH*', arrows: 'to', width: 3, color: '#333333' }
    ];

    const subtitles = [
        'User calls transfer on the USDC contract to transfer 1000 USDC to the pool',
        'User calls exchange_received to swap 1000 USDC to 1 WETH',
        'Pool executes the swap and transfers 1 WETH to the user'
    ];

    const container = document.getElementById('graph-b2');
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
            dragView: false,
            zoomView: false,
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
        document.getElementById('subtitle-b2').textContent = subtitle;

        // Update step counter
        document.getElementById('stepCounter-b2').textContent = `Step: ${step + 1}/${edges.length}`;
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

    const prevButton = document.getElementById('prevButton-b2');
    const nextButton = document.getElementById('nextButton-b2');
    const playPauseButton = document.getElementById('playPauseButton-b2');
    const playIcon = document.getElementById('playIcon-b2');
    const pauseIcon = document.getElementById('pauseIcon-b2');

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
            } else {
                startAnimation();
            }
        }
    });

    // Show the first step initially
    showStep(currentStep);
});