class CurvePool {
    constructor(A, balances, n, fee = 4e6, fee_mul = null, admin_fee = 5e9) {
        this.A = A;
        this.balances = balances;
        this.n = n;
        this.fee = fee;
        this.fee_mul = fee_mul !== null ? (fee_mul) : null;
        this.admin_fee = admin_fee;
    }

    xp() {
        return this.balances.map(x => x);
    }

    calculateD(xp) {
        let Dprev = 0;
        let S = xp.reduce((a, b) => a + b, 0);
        let D = S;
        let n = xp.length;
        let Ann = this.A * n;
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

    get_y(i, j, x, xp) {
        let A = this.A;
        let D = this.calculateD(xp);
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
            y = Math.floor(((y ** 2 + c) / (2 * y + b)));
        } while (Math.abs(y - yPrev) > 1);
        return y;
    }

    exchange(i, j, dx) {
        let xp = this.xp();
        let x = xp[i] + dx;
        let y = this.get_y(i, j, x, xp);
        let dy = xp[j] - y - 1;
        let fee = this.fee_mul ? this.dynamic_fee(Math.floor((xp[i] + x) / 2), Math.floor((xp[j] + y) / 2)) / 1e10 : this.fee / 1e10;
        fee = Math.floor(fee * dy);
        let admin_fee = Math.floor(fee * this.admin_fee / (1e10));
        dy = dy - fee;
        this.balances[i] += (dx);
        this.balances[j] -= dy + admin_fee;
        return [dy, fee];
    }

    dydx(i, j, use_fee = false) {
        let xp = this.xp();
        let D = this.calculateD(xp);
        let xi = xp[i];
        let xj = xp[j];
        let x_prod = xp.reduce((acc, x) => acc * x, 1);
        let A_pow = this.A * this.n ** (this.n + 1);
        let D_pow = D ** (this.n + 1);
        let dydx = (xj * (xi * A_pow * x_prod + D_pow) * 1000) / (xi * (xj * A_pow * x_prod + D_pow) * 1000);
        if (use_fee) {
            let fee_factor = this.dynamic_fee(xi, xj) / (1e10);
            dydx = dydx * ((1e10) - fee_factor) / (1e10);
        }
        return dydx;
    }

    dynamic_fee(xi, xpj) {
        let xps2 = (xi + xpj) ** (2);
        return this.fee_mul !== null ? (this.fee_mul * this.fee) / ((this.fee_mul - (1e10)) * (4) * xi * xpj / xps2 + (1e10)) : this.fee;
    }
}

function solveForSlippage(victimAmount, fee = 4e6, feeMul = null, slippage = 0.1, tolerance = 0.0001, balances = [1e8, 1e8]) {
    let currentGuess = victimAmount * 2;
    const targetReceived = victimAmount * (1 - slippage);
    let i = 0;

    while (i < 1000) {
        const pool = new CurvePool(200, [...balances], 2, fee, feeMul);
        pool.exchange(1, 0, currentGuess);
        const [received, fees] = pool.exchange(1, 0, victimAmount);

        if (Math.abs(received - targetReceived) / victimAmount < tolerance) {
            break;
        }
        const receivedDifference = received - targetReceived;
        const adjustmentFactor = receivedDifference / victimAmount;
        currentGuess += adjustmentFactor * currentGuess;
        i += 1;
    }

    return currentGuess;
}

