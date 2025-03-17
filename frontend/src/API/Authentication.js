import axios from "axios";

export const login = async(username, password, remember) => {
    try {
        const response = await axios.post("/batdetective/auth/login", {username, password});
        if (response.status === 200) {
            //localStorage.setItem("AUTH_TOKEN", response.data.data);
            if(remember === true){
                const expirationTime = 7 * 24 * 60 * 60; //7 days
                document.cookie = `AUTH_TOKEN=${response.data.data}; Secure; path=/; SameSite=Strict; Max-Age=${expirationTime}`;
            }else{
                document.cookie = `AUTH_TOKEN=${response.data.data}; Secure; path=/; SameSite=Strict;`;
            }
            localStorage.setItem("username",username);
            return "OK";
        }
    }catch (e){
        return e.response.data.message;
    }
}

export const getAuthToken = () => {
    const cookies = document.cookie.split("; ");
    const tokenCookie = cookies.find((cookie) => cookie.startsWith("AUTH_TOKEN="));
    if (tokenCookie) {
        return tokenCookie.split("=")[1];
    }
    return null;
};

export const checkToken = async () =>{
    try {
        const token = getAuthToken();
        if(token === null){
            return false;
        }
        const response = await axios.get("/api/locations", {headers:{Authorization: 'Bearer ' + token}});
        if (response.status === 200) {
            return true;
        }
        else{
            return false;
        }
    }catch (e){
        return false;
    }
}

const decodeBase64Url = (base64Url) => {
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');

    const json = atob(base64);

    return JSON.parse(json);
};

export const getUserRole = () =>{
    const token = getAuthToken()

    const [header, payload] = token.split('.');

    const decodedPayload = decodeBase64Url(payload)

    return decodedPayload.scope
}
