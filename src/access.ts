export default function(initialState:{currentUser:{type:string}}){
    console.log(initialState,'----initialState---');
    const {currentUser} = initialState;
    return {
        routePermission:true
    }
}