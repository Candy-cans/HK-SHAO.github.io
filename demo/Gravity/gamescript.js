const fps = 10000;
const dt = 0.02;
const cfa = document.getElementById("father");
const canv = document.getElementById("gc");
const ctx = canv.getContext("2d");
const canv2 = document.getElementById("gc2");
const ctx2 = canv2.getContext("2d");
const pl = 10;
const pld2 = pl / 2;
const mu = 0.3;

t = 0;
pa = [0, 0];
pv = [0, 0];
px = [10, 10];
lpx = [0, 0];
interval = undefined;

ipw = false;
ipa = false;
ips = false;
ipd = false;

function csqr(z) {
    return [z[0] * z[0] - z[1] * z[1], 2 * z[0] * z[1]];
}

function cadd(z1, z2) {
    return [z1[0] + z2[0], z1[1] + z2[1]];
}

function Julia(x, y, a = -0.056, b = 0.68, n = 400) {
    let z = [x, y];
    let c = [a, b];
    for (let i = 0; i < n; i++) {
        z = cadd(csqr(z), c);
        if (Math.abs(z[0]) > 1 && Math.abs(z[1]) > 1) {
            z = [NaN, NaN];
            break;
        }
    }
    return [z[0], z[1], Math.sqrt(z[0] * z[0] + z[1] * z[1])];
}

window.onload = function () {
    window.onresize();
    interval = window.setInterval(refresh, 1000 / fps);

    ctx2.clearRect(0, 0, size, size);
    ctx2.fillRect(0, 0, 8, size);
    ctx2.fillRect(size - 8, 0, 8, size);
    ctx2.fillRect(0, 0, size, 8);
    ctx2.fillRect(0, size - 8, size, 8);

    ctx2.fillRect(size / 2 - 100, size / 2, size / 2, 20);
    ctx2.fillRect(0, size / 2 + 370, size / 1.5, 20);
    ctx2.beginPath();
    ctx2.lineWidth = 8;
    ctx2.moveTo(0, 100);
    ctx2.lineTo(400, 600);
    ctx2.arc(400, 740, 60, 0, Math.PI);
    ctx2.stroke();

    let jd = size / 2000;
    for (let i = 0; i < size; i += jd) {
        for (let j = 0; j < size; j += jd) {
            x = 2 * (2 * i - size) / size;
            y = -2 * (2 * j - size) / size;
            let ob = this.Julia(x - 0.5, y);
            let r = ob[0] * 255;
            let g = ob[1] * 255;
            let b = ob[2] * 255;
            if (isNaN(r) || isNaN(g) || isNaN(b)) {
                continue;
            }
            ctx2.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
            let py = jd;
            ctx2.fillRect(i, j, py + 1, py + 1);
        }
    }

}

window.onresize = function () {
    size = Math.min(window.innerWidth / 2, window.innerHeight * 0.95);
    cfa.style.width = size + "px";
    cfa.style.height = size + "px";
    canv.width = size;
    canv.height = size;
    canv2.width = size;
    canv2.height = size;
    pa[1] = size / 10;
}

function judgeY(m = 0) {
    let pixel = ctx2.getImageData(px[0] + pld2, px[1] - m, 1, 1).data;
    if (pixel[3] != 0) {
        return true;
    }
    return false;
}

function judgeX(m = 0) {
    let pixel = ctx2.getImageData(px[0] - m, px[1] + pld2, 1, 1).data;
    if (pixel[3] != 0) {
        return true;
    }
    return false;
}

function judgeY2(m = 0) {
    let pixel = ctx2.getImageData(px[0] + pld2, px[1] + pl + m, 1, 1).data;
    if (pixel[3] != 0) {
        return true;
    }
    return false;
}

function judgeX2(m = 0) {
    let pixel = ctx2.getImageData(px[0] + pl + m, px[1] + pld2, 1, 1).data;
    if (pixel[3] != 0) {
        return true;
    }
    return false;
}

function judgeJ() {
    return (judgeY2(2));
}

function refresh2() {

}

function refresh() {
    t += dt;
    refresh2()
    ctx.clearRect(0, 0, size, size);
    pv[0] += pa[0] * dt;
    pv[1] += pa[1] * dt;
    px[0] += pv[0] * dt + 0.5 * pa[0] * dt * dt;
    px[1] += pv[1] * dt + 0.5 * pa[1] * dt * dt;

    let jxb = judgeX(-1);
    let jx2b = judgeX2(-1);
    let jyb = judgeY(-1);
    let jy2b = judgeY2(-1);

    if (jxb) {
        px[0] = lpx[0];
        pv[0] = mu * Math.abs(pv[0]);
    }
    if (jx2b) {
        px[0] = lpx[0];
        pv[0] = -mu * Math.abs(pv[0]);
    }
    if (jxb || jx2b) {
        pa[1] = size / 10 + Math.sign(pv[1]) * -50;
    } else {
        lpx[0] = px[0];
        pa[1] = size / 10;
    }

    if (jyb) {
        px[1] = lpx[1] + 1;
        pv[1] = mu * Math.abs(pv[1]);
    }
    if (jy2b) {
        px[1] = lpx[1] - 1;
        pv[1] = -mu * Math.abs(pv[1]);
    }
    if (jyb || jy2b) {
        pa[0] = Math.sign(pv[0]) * -200;
    } else {
        lpx[1] = px[1];
        pa[0] = 0;
    }

    if (ipw && judgeJ()) {
        pv[1] = -140;
    }
    if (ips) {
        pv[1] = 100;
    }
    if (ipa) {
        pv[0] = -40;
    }
    if (ipd) {
        pv[0] = 40;
    }

    ctx.beginPath();
    ctx.fillStyle = "red";
    ctx.arc(px[0] + pld2, px[1] + pld2, pld2, 0, 2 * Math.PI);
    ctx.fill();
}

document.onkeydown = function (e) {
    e.preventDefault();
    switch (e.keyCode) {
        case 38:
            ipw = true;
            break;
        case 40:
            ips = true;
            break;
        case 37:
            ipa = true;
            break;
        case 39:
            ipd = true;
            break;
    }
}

document.onkeyup = function (e) {
    e.preventDefault();
    switch (e.keyCode) {
        case 32:
            if (interval == undefined) {
                interval = window.setInterval(refresh, 1000 / fps);
            } else {
                window.clearInterval(interval);
                interval = undefined;
            }
            break;
        case 38:
            ipw = false;
            break;
        case 40:
            ips = false;
            break;
        case 37:
            ipa = false;
            break;
        case 39:
            ipd = false;
            break;
    }
}