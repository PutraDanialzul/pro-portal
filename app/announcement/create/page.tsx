'use client';

import { useRouter } from "next/navigation";
import { SubmitEvent } from "react";

export default function NewAnnouncementPage(){

    const router = useRouter();

    async function addAnnouncement(event:SubmitEvent<HTMLFormElement>){
        event.preventDefault();
        router.replace("/announcement");
    }

    return (
        <div>
            <form onSubmit={addAnnouncement}>
                <textarea></textarea>
                <input type="submit" value="Add Announcement"></input>
            </form>
        </div>
    );
}