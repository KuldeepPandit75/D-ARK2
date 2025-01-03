


export const getAccessToken=()=>{
    return sessionStorage.getItem("accessToken")
}

export const getType=(value,body)=>{
    if(value.query){
        return {query: body}
    }else if(value.params){
        if(typeof body=== "object"){
            return {params: body._id}
        }else{
            return {params: body}
        }
    }
    return {};
}