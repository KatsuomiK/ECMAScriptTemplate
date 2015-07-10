import GameObject from "./GameObject";

export default class Player extends GameObject {
    constructor() {
        super();

        this.speed = 5;
        this.rotation = 0;
    }

    update(deltaTime, targetPosition) {
        this.rotation = Math.atan2(targetPosition.y - this.position.y, targetPosition.x - this.position.x);

        if (this.position.distanceTo(targetPosition) > this.speed * deltaTime) {
            this.velocity.subVectors(targetPosition, this.position);
            this.velocity.setLength(this.speed);
        } else {
            this.velocity.set(0, 0, 0);
        }
    }
}
