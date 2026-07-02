'use client';

import './announcement-style.css';

export default function AnnouncementPage() {
    return (
        <div className="announcement-container">
            <div className="header">
                <h1>Announcement</h1>

                <a
                    href="/announcement/create"
                    className="create-btn"
                >
                    Create Announcement
                </a>
            </div>

            <table className="announcement-table">
                <thead>
                    <tr>
                        <th>No.</th>
                        <th>Announcement</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>1</td>
                        <td>System maintenance on Friday.</td>
                    </tr>
                    <tr>
                        <td>2</td>
                        <td>New feature released.</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}