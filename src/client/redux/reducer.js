
import { nameChangeAction, cityChangeAction, newUserChangeAction } from './actionTypes'

let initState = {
    name: 'aarthi',
    city: 'thanjavur',
    newUser : false
}

const reducerFunction = (state = initState, action) => {
    switch (action.type) {
        case nameChangeAction:
            return { ...state, name: action.name }
        case cityChangeAction:
            return { ...state, city: action.city }
        case newUserChangeAction:
            return {...state, newUser: action.newUser}
        default:
            return state;
    }
}

export default reducerFunction