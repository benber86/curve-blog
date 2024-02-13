function calculateD(xp, A) {
    let Dprev = 0;
    let S = xp.reduce((a, b) => a + b, 0);
    let D = S;
    let n = xp.length;
    let Ann = A * n;
    while (Math.abs(D - Dprev) > 1) {
        let D_P = D;
        xp.forEach(x => {
            D_P = D_P * D / (n * x);
        });
        Dprev = D;
        D = (Ann * S + D_P * n) * D / ((Ann - 1) * D + (n + 1) * D_P);
    }
    return D;
}

function getY(A, i, j, x, xp) {
    let D = calculateD(xp, A);
    let n = xp.length;
    let Ann = A * n;
    let xx = [...xp];
    xx[i] = x;
    let filteredXp = xx.filter((_, index) => index !== j);

    let c = D;
    filteredXp.forEach(y => {
        c = Math.floor(c * D / (y * n));
    });
    c = Math.floor(c * D / (Ann * n));

    let b = filteredXp.reduce((acc, curr) => acc + curr, 0) + Math.floor(D / Ann) - D;

    let yPrev = 0;
    let y = D;

    do {
        yPrev = y;
        y = ((y ** 2 + c) / (2 * y + b));
    } while (Math.abs(y - yPrev) > 1);
    return y;
}
