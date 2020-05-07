import React from  'react';


const User = (props) => {
    const user = props.user
    return(
        <div className="label"><input onClick={()=>{props.checkUser(user)}} type="checkbox" value={user} /> <span>{user}</span> </div>
    )
}

class Users extends React.Component {
    render(){
        const me = this
        const users = this.props.users.map(function(user){
            return <User checkUser={me.props.checkUser} user={user}></User>
        })
        return(
            <div className="users">
                {users}
            </div>
        )
    }
} 
export default Users