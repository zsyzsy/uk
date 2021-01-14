import { login, logout } from '@/api/user'
import { getToken, setToken, removeToken, getUserMessage, setUserMessage, removeUserMessage } from '@/utils/auth'
import { resetRouter } from '@/router'

const getRouterList = () => {
  return sessionStorage.getItem('routerList') && JSON.parse(sessionStorage.getItem('routerList')) || []
}

const saveRouterList = routers => {
  const routerList = JSON.stringify(routers)
  sessionStorage.setItem('routerList', routerList)
}

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    user: getUserMessage(),
    routers: getRouterList(),
    checkedRouter: ''
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_LOGIN: (state, data) => {
    state.user = data
  },
  SET_ROUTER: (state, data) => {
    const haved = state.routers.some(res => {
      return res.name === data.name
    })
    if (!haved) {
      state.routers.push(data)
      saveRouterList(state.routers)
    }
  },
  SET_ROUTERS: (state, data) => {
    state.routers = data
    saveRouterList(state.routers)
  },
  REPLACE_ROUTER: (state, data) => {
    for (let index = 0; index < state.routers.length; index++) {
      const ele = state.routers[index]
      if (ele.url === data.fromUrl) {
        state.routers.splice(index, 1, data)
        saveRouterList(state.routers)
        break
      }
    }
  },
  CHECKED_ROUTER: (state, data) => {
    state.checkedRouter = data
  },
  DEL_ROUTER: (state, data) => {
    state.routers.splice(data, 1)
    saveRouterList(state.routers)
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    return new Promise((resolve, reject) => {
      login(userInfo).then(response => {
        if (response.code === '00') {
          commit('SET_TOKEN', response.context.tokenId)
          commit('SET_LOGIN', response.context)
          setToken(response.context.tokenId)
          setUserMessage(response.context)
          resolve(true)
        } else {
          resolve(false)
        }
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout().then((res) => {
        removeToken() // must remove  token  first
        removeUserMessage()
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  },

  addRouter({ commit }, data) {
    commit('SET_ROUTER', data)
    commit('CHECKED_ROUTER', data.name)
  },
  setRouters({ commit }, data) {
    commit('SET_ROUTERS', data)
  },
  replaceRouter({ commit }, data) {
    commit('REPLACE_ROUTER', data)
    commit('CHECKED_ROUTER', data.name)
  },

  delRouter({ commit }, data) {
    commit('DEL_ROUTER', data)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

