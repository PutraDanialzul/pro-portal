'use client';

import "./login-style.css"

import { supabaseClient } from "../../lib/supabase";

export default function LoginPage(){

    async function login(event:React.SubmitEvent<HTMLFormElement>){
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const email = formData.get("email");
        const password = formData.get("password");
        const { data, error } = await supabaseClient.auth.signInWithPassword({
            email: email as string,
            password: password as string,
        });
        if(error){
            alert("Error: "+error.message);
        }
        else{
            window.location.assign("dashboard");
        }
    }

    return (
        <div>
            <h1>Login Page</h1>
            <form onSubmit={login}>
                <label htmlFor="email">Email: </label>
                <input type="email" name="email" id="email"></input>
                <br></br>
                <br></br>
                <label htmlFor="password">Password: </label>
                <input type="password" name="password" id="password"></input>
                <br></br>
                <input type="submit" value="Log In"></input>
            </form>
        </div>
    );
}