import { Module, ActionTree, GetterTree, MutationTree } from 'vuex';
import { StateInterface } from '../index';
import { api } from 'boot/axios'

export interface AuthStateInterface {
  user: UserInterface | null;
  isAuth: boolean;
  twoFactor: boolean;
}

export interface UserInterface {
  id: number;
  name: string;
  email: string;
  email_verified_at: Date | null;
  profile_photo_path: string | null;
  two_factor_recovery_codes: string| null;
  two_factor_secret: string | null;
  deleted_at: Date | null;
  created_at: Date;
  updated_at: Date;
}

function state(): AuthStateInterface {
  return {
    user: null,
    isAuth: false,
    twoFactor: false
  }
}

const mutations: MutationTree<AuthStateInterface> = {
  SET_AUTH_USER (state: AuthStateInterface, user: UserInterface) {
    state.isAuth = true
    state.user = user
  },

  REMOVE_AUTH (state: AuthStateInterface) {
    state.isAuth = false
    state.user = null
  },

  SET_TWO_FACTOR (state: AuthStateInterface, value: boolean) {
    state.twoFactor = value
  }
};

const getters: GetterTree<AuthStateInterface, StateInterface> = {
  user (state: AuthStateInterface) {
    return state.user
  },

  isAuth (state: AuthStateInterface) {
    return state.isAuth
  },

  twoFactor (state: AuthStateInterface) {
    return state.twoFactor
  }
};

const actions: ActionTree<AuthStateInterface, StateInterface> = {
  async login ({ dispatch }, creds) {
    await api.post('login', creds)
    await dispatch('user')
  },

  async logout ({ commit }) {
    await api.post('logout')
    commit('REMOVE_AUTH')
  },

  async user ({ commit }) {
    await api.get('me')
      .then(response => {
        if (!response.data) {
          commit('REMOVE_AUTH')
          return
        }
        commit('SET_AUTH_USER', response.data)
      })
      .catch(error => {
        commit('REMOVE_AUTH')
        throw error
      })
  }
};

const authModule: Module<AuthStateInterface, StateInterface> = {
  namespaced: true,
  actions,
  getters,
  mutations,
  state
}

export default authModule;
