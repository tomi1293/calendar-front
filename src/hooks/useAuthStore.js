import { useDispatch, useSelector } from "react-redux"
import { calendarApi } from "../api";
import { clearErrorMessage, onChecking, onLogin, onLogout } from "../store";

//*Podemos usar un hook para las funciones asincornas en lugar de usar thunks. Es otra forma de hacerlo.
export const useAuthStore = () => {

    const { status, user, errorMessage } = useSelector( state => state.auth );
    const dispatch = useDispatch();
    

    const startLogin = async({email,password}) => {
        
        dispatch( onChecking() )

        try {
            //Hcemos la peticion para logearnos
            const { data } = await calendarApi.post('/auth',{email, password});
        
            //Guardamos el token en el localStorage
            localStorage.setItem('token', data.token)
            localStorage.setItem('token-init-date', new Date().getTime()) //Grabamos el momento en el que generamos el token para hacer caclulos sobre tiempo para que expire el token

            dispatch(onLogin({name: data.name, uid: data.uid}))

        } catch (error) {
            console.log({error})
            dispatch(onLogout('Credenciales Incorrectas'));
            setTimeout(() => {
                dispatch(clearErrorMessage());
            }, 10);
        }

    }

    const startRegister = async({name,email,password}) => {

        dispatch( onChecking() )

        try {
            const {data} = await calendarApi.post('/auth/new',{name,email,password});
            //Guardamos el token en el localStorage
            localStorage.setItem('token', data.token)
            localStorage.setItem('token-init-date', new Date().getTime()) //Grabamos el momento en el que generamos el token para hacer caclulos sobre tiempo para que expire el token

            dispatch(onLogin({name: data.name, uid: data.uid}))
        } catch (error) {

            //Si en error.response.data hay algo accedemos a msg, si no usamos '--'
            dispatch(onLogout(error.response.data?.msg || '--'));
            setTimeout(() => {
                dispatch(clearErrorMessage());
            }, 10);
        }
    }


    const checkAuthToken = async() => {
        const token = localStorage.getItem('token');
        if(!token) return dispatch(onLogout());

        try {
            const { data } = await calendarApi.get('/auth/renew');
            localStorage.setItem('token', data.token)
            localStorage.setItem('token-init-date', new Date().getTime())
            dispatch(onLogin({name: data.name, uid: data.uid}))
        } catch (error) {
            localStorage.clear();
            dispatch(onLogout());
        }
    }

    const startLogout = () => {
        localStorage.clear()
        dispatch(onLogout())
    }

    return {
        //*Propiedades
        status,
        user,
        errorMessage,

        //*Metodos
        startLogin,
        startRegister,
        checkAuthToken,
        startLogout
    }
}