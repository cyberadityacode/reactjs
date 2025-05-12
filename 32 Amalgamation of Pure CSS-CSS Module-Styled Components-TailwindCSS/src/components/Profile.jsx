const Profile = ()=> {
    return (

        <ProfileCard
            username="aditya"
            age = {31}
            greeting = {
                <p>Hi aditya, Have a Wonderfull Day</p>
            }
            >
                <p>Hobbies: Exploring Conciousness &  esoteric mysteries</p>
                <button>Contact</button>

        </ProfileCard>
    );
}

export default Profile;

function ProfileCard(props){
    const {username, age, greeting, children} = props;
    return (
        <>
            <h2>Name: {username}</h2>
            <p>Age {age}:</p>
            <div>{greeting}</div>
            <span>{children}</span>
        </>
    )
}