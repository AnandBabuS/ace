import { nameChangeAction, cityChangeAction,newUserChangeAction } from './actionTypes'

export const nameChangeActionCreator = (name) => {
    return {
        type: nameChangeAction,
        name
    }
}


export const cityChangeActionCreator = (city) => {
    return {
        type: cityChangeAction,
        city
    }
}
export const newUserChangeActionCreator = (newUser) => {
    return {
        type: newUserChangeAction,
        newUser
    }
}

export default {
    nameChangeActionCreator,
    cityChangeActionCreator,
    newUserChangeActionCreator
}