import MyMath from './framesynthesis/MyMath'
import GameObject from './GameObject'

export default class Ball extends GameObject {
  constructor () {
    super()

    const x = MyMath.random(-5, 5)
    const y = MyMath.random(-5, 5)
    const z = MyMath.random(5, 10)

    this.position.set(x, y, z)
  }

  update (deltaTime) {
    this.acceleration.set(0, 0, -10)

    if (this.velocity.z < 0 && this.position.z < 0) {
      this.acceleration.set(0, 0, 0)
      this.velocity.z *= -1
    }
  }
}
