class User {
  constructor({
    id,
    email,
    username,
    firstName,
    lastName,
    avatar,
    role = 'user',
    isEmailConfirmed = false,
    dateRegistered = new Date().toISOString(),
    lastLoginDate,
    settings = {
      theme: 'light',
      language: 'uk',
      notifications: true
    },
    TokensAvailable
  }) {
    this.id = id;
    this.email = email;
    this.username = username;
    this.firstName = firstName;
    this.lastName = lastName;
    this.avatar = avatar;
    this.role = role;
    this.isEmailConfirmed = isEmailConfirmed;
    this.dateRegistered = dateRegistered;
    this.lastLoginDate = lastLoginDate;
    this.settings = settings;
    this.TokensAvailable = typeof TokensAvailable !== 'undefined' ? TokensAvailable : null;
  }
}

export { User };