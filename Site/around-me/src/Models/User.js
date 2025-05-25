/**
 * @typedef {Object} User
 * @property {string} id
 * @property {'standard' | 'google' | 'facebook'} type
 * @property {string} name
 * @property {string} email
 * @property {string} [avatar] - URL или Base64 строка изображения аватара
 * @property {string} [avatarThumbnail] - URL или Base64 строка миниатюры аватара
 * @property {string} [password]
 * @property {string} [firstName]
 * @property {string} [lastName]
 * @property {string} [registrationDate] - Дата регистрации пользователя
 */

/**
 * @typedef {Object} UserLoginRequest
 * @property {'standard' | 'google' | 'facebook'} type
 * @property {string} email
 * @property {string} password
 */

/**
 * @typedef {Object} UserRegisterRequest
 * @property {'standard' | 'google' | 'facebook'} type
 * @property {string} name
 * @property {string} email
 * @property {string} password
 */

/**
 * @typedef {Object} UserResponse
 * @property {string} token
 * @property {User} user
 */

/**
 * @typedef {Object} UpdateAvatarRequest
 * @property {string} avatarData - Base64 строка изображения
 * @property {string} [avatarType] - MIME тип изображения (например, 'image/jpeg')
 */

/**
 * @typedef {Object} UpdateUserRequest
 * @property {string} [name]
 * @property {string} [email]
 * @property {string} [password]
 * @property {string} [firstName]
 * @property {string} [lastName]
 * @property {string} [avatar]
 */ 