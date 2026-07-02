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
            router.replace("/dashboard");
        }
    }

    useEffect(()=>{
        async function checkUser(){
            const {data:{user}} = await supabaseClient.auth.getUser();
            if(user){
                router.replace("/dashboard");
            }
        }
        checkUser();
    }, [router]);

    return (
        <div id="login-window">
            <div id="left-content">
                <h1>Welcome Back!</h1>
                <i id="quote">“believe you can and you’re halfway there”</i>
            </div>
            <div id="right-content">
                <h1>Login Page</h1>
                <form onSubmit={login}>
                    <input type="email" name="email" id="email" placeholder="Email" required></input>
                    <input type="password" name="password" id="password" placeholder="Password" required></input>
                    <input type="submit" id="login-button" value="Log In"></input>
                </form>
                <center>
                    <p>Don't have an account yet?</p>
                    <a href="/sign-up">Sign up</a>
                </center>
            </div>
        </div>
    );
}