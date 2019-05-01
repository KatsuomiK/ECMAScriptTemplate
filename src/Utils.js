export default class Utils {
    static toLogicalPosition(pageX, pageY) {
        const w = window.innerWidth;
        const h = window.innerHeight;

        const max = Math.max(w, h);

        const x = (event.pageX - w / 2) / max;
        const y = (event.pageY - h / 2) / max;

        return {
            x: x,
            y: y
        };
    }
}
