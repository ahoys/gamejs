class Player {

  /**
   * Returns whether the player is alive.
   */
  isAlive() {
    return this.pHealth > 0;
  }

  /**
   * Sets experience.
   * @param {number} value
   */
  set experience(value) {
    this.pExperience = value;
  }

  /**
   * Returns experience.
   */
  get experience() {
    return this.pExperience;
  }

  /**
   * Sets player health.
   * @param {number} value
   */
  set health(value) {
    this.pHealth = value;
  }

  /**
   * Returns player health.
   */
  get health() {
    return this.pHealth;
  }

  /**
   * Sets player position.
   * @param {object} value
   */
  set pos(value) {
    this.x = value.x;
    this.y = value.y;
    this.z = value.z;
  }

  /**
   * Returns player position.
   */
  get pos() {
    return {
      x: this.pX,
      y: this.pY,
      z: this.pZ,
    }
  }

  /**
   * Returns name of the player.
   */
  get name() {
    return pName;
  }
  
  constructor(name, x, y, z) {
    this.pName = name;
    this.pX = x;
    this.pY = y;
    this.pZ = z;
    this.pHealth = 100;
    this.pExperience = 0;
  }
}

module.exports = Player;
