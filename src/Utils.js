export default class Utils {
    static toLogicalPosition(pageX, pageY) {
        let w = window.innerWidth;
        let h = window.innerHeight;

        let max = Math.max(w, h);

        let x = (event.pageX - w / 2) / max;
        let y = (event.pageY - h / 2) / max;

        return {
            x: x,
            y: y
        };
    }
}
