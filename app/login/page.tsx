'use client';

import styles from "./login-style.module.css"

import { supabaseClient } from "../../lib/supabase";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage(){

    const router = useRouter();

    const [error, setError] = useState("");

    async function login(event:React.SubmitEvent<HTMLFormElement>){
        event.preventDefault();
        setError("");
        const formData = new FormData(event.currentTarget);
        const email = formData.get("email");
        const password = formData.get("password");
        if(!email.toString().trim() || !password.toString().trim()){
            setError("Error: Email or password cannot be blank.");
            return;
        }
        const { data, error } = await supabaseClient.auth.signInWithPassword({
            email: email as string,
            password: password as string,
        });
        if(error){
            setError("Error: " + error.message+".");
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
        setError("");
    }, [router]);
    
    return (
        <div className={styles.loginWindow}>
            { error.trim() ? <p className={styles.errorBanner}>{error}</p> : null }
            <div className={styles.flexContainer}>
                <div className={styles.leftContent}>
                    <h1>Welcome Back!</h1>
                    <i className={styles.quote}>“believe you can and you’re halfway there”</i>
                </div>
                <div className={styles.rightContent}>
                    <h1>Login Page</h1>
                    <form onSubmit={login}>
                        <input type="email" name="email" className={styles.textInput} id="email" placeholder="Email"></input>
                        <input type="password" name="password" className={styles.textInput} id="password" placeholder="Password"></input>
                        <input type="submit" className={styles.loginButton} value="Log In"></input>
                    </form>
                    <center>
                        <p>Don't have an account yet?</p>
                        <a href="/sign-up">Sign up</a>
                    </center>
                </div>
            </div>
        </div>
    );
}