import { supabaseClient } from "../lib/supabase"

export default async function HomePage(){
    const {data, error} = await supabaseClient.auth.getSession();
    console.log(data, error);
    return (
        <h1>
            Hello World
        </h1>
    );
}