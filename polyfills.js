/**
 * Poly-fills for various Objects.
 * Created by eros on 2/11/16.
 */
if (!Array.prototype.randomElement) {
    Array.prototype.randomElement = function () {
        return this[Math.floor(Math.random() * this.length)]
    };
}
