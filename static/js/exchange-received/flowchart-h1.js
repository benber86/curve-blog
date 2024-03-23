document.addEventListener('DOMContentLoaded', function() {
    const nodes = [
        { id: 1, label: '*User*', color: '#FFA384', shape: 'box', x: 100, y: 550, font: { bold: true } },
        { id: 2, label: '*USDC Token*\n*Contract*', color: '#EFE7BC', shape: 'box', x: 300, y: 650, font: { bold: true } },
        { id: 3, label: '*WETH/USDC*\n*Pool*', color: '#74BDCB', shape: 'box', x: -250, y: 600, font: { bold: true } },
        { id: 4, label: '*WETH Token*\n*Contract*', color: '#E7F2F8', shape: 'box', x: 300, y: 300, font: { bold: true } },
        { id: 5, label: '*WETH/CRV*\n*Pool*', color: '#FFE5D9', shape: 'box', x: -150, y: 300, font: { bold: true } }
    ];

    const edges = [
        { id: 1, from: 1, to: 2, label: '*Approve*', arrows: 'to', width: 3, color: '#333333' },
        { id: 2, from: 1, to: 3, label: '*1000 USDC*', arrows: 'to', width: 3, color: '#333333' },
        { id: 3, from: 3, to: 1, label: '*1 WETH*', arrows: 'to', width: 3, color: '#333333' },
        { id: 4, from: 1, to: 4, label: '*Approve*', arrows: 'to', width: 3, color: '#333333' },
        { id: 5, from: 1, to: 5, label: '*1 WETH*', arrows: 'to', width: 3, color: '#333333' },
        { id: 6, from: 5, to: 1, label: '*100 CRV*', arrows: 'to', width: 3, color: '#333333' }
    ];

    const subtitles = [
        'User approves the USDC/WETH pool for spending on the USDC contract',
        'User calls exchange and the pool transfers 1000 USDC from the user to itself',
        'Pool executes the swap and transfers 1 WETH to the user',
        'User approves the CRV/WETH pool to spend the received 1 WETH',
        'User calls exchange and the pool transfers 1 WETH from the user to itself',
        'Pool executes the swap and transfers 100 CRV to the user'
    ];

    const container = document.getElementById('graph-h1');
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
                roundness: 0.3
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
        document.getElementById('subtitle-h1').textContent = subtitle;

        // Update step counter
        document.getElementById('stepCounter-h1').textContent = `Step: ${step + 1}/${edges.length}`;
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

    const prevButton = document.getElementById('prevButton-h1');
    const nextButton = document.getElementById('nextButton-h1');
    const playPauseButton = document.getElementById('playPauseButton-h1');
    const playIcon = document.getElementById('playIcon-h1');
    const pauseIcon = document.getElementById('pauseIcon-h1');

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