/**
 * UserModel - Model representing user data
 */
export class UserModel {
  constructor(data = {}) {
    this.id = data.id || null
    this.nik = data.nik || ''
    this.username = data.username || ''
    this.name = data.name || ''
    this.email = data.email || ''
    this.role = data.role || 'user'
    this.token = data.token || null // Store the JWT token
  }

  /**
   * Validates the user data
   * @returns {boolean} True if valid, false otherwise
   */
  isValid() {
    return this.id && (this.nik || this.email) && this.token
  }

  /**
   * Creates a local storage compatible object
   * @returns {Object} Plain object for storage
   */
  toStorageObject() {
    return {
      id: this.id,
      nik: this.nik,
      username: this.username,
      name: this.name,
      email: this.email,
      role: this.role,
      token: this.token, // Include token in storage
    }
  }

  /**
   * Creates a UserModel from local storage data
   * @param {Object} data - Data from storage
   * @returns {UserModel} New UserModel instance
   */
  static fromStorage(data) {
    return new UserModel(data)
  }
}
