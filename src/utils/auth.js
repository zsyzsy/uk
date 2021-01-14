import Cookies from 'js-cookie'

const TokenKey = 'authentication_token'
const UserMessage = 'UserMessage'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getUserMessage() {
  return JSON.parse(localStorage.getItem(UserMessage))
}

export function setUserMessage(message) {
  message = JSON.stringify(message)
  return localStorage.setItem(UserMessage, message)
}

export function removeUserMessage() {
  return localStorage.clear()
}
