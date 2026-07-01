'use client';

import "./login-style.css"

import { supabaseClient } from "../../lib/supabase";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage(){

    const router = useRouter();

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
            router.push("dashboard");
        }
    }

    useEffect(()=>{
        async function getUser(){
            const user = await supabaseClient.auth.getUser();
            if(user.data.user)
                router.replace("/dashboard");
        }
    }, [router]);

    return (
        <div>
            <h1>Login Page</h1>
            <form onSubmit={login}>
                <label htmlFor="email">Email: </label>
                <input type="email" name="email" id="email" required></input>
                <br></br>
                <br></br>
                <label htmlFor="password">Password: </label>
                <input type="password" name="password" id="password" required></input>
                <br></br>
                <input type="submit" value="Log In"></input>
            </form>
        </div>
    );
}