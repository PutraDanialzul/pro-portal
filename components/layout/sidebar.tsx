import "./sidebar-style.css"

export default function Sidebar(){
    return (
        <nav id="sidebar">
            <a href="/dashboard">Dashboard</a>
            <a href="/task">Task</a>
            <a href="/announcement">Announcement</a>
            <a href="/profile-settings">Settings</a>
        </nav>
    );
}