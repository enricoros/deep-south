/**
 * Poly-fills for various Objects.
 * Created by eros on 2/11/16.
 */
if (!Array.prototype.randomElement) {
    Array.prototype.randomElement = function () {
        return this[Math.floor(Math.random() * this.length)]
    };
}

// we love to be nice to the eye
$.easing.easeOutCubic = function (x, t, b, c, d) {
    return c*((t=t/d-1)*t*t + 1) + b;
};
