import "./ActivityTimeline.css";

import {
    HeartHandshake,
    CalendarDays,
    HandHeart,
    BookOpen,
    Users,
    Clock,
} from "lucide-react";

const activities = [
    {
        id: 1,
        icon: HeartHandshake,
        title: "New Donation Received",
        description: "Grace A. donated ₦50,000 for Church Planting.",
        time: "5 mins ago",
        color: "green",
    },
    {
        id: 2,
        icon: HandHeart,
        title: "Prayer Request",
        description: "John David submitted a prayer request.",
        time: "20 mins ago",
        color: "blue",
    },
    {
        id: 3,
        icon: CalendarDays,
        title: "Event Registration",
        description: "Sarah Johnson registered for Youth Conference.",
        time: "1 hour ago",
        color: "orange",
    },
    {
        id: 4,
        icon: BookOpen,
        title: "New Sermon Published",
        description: "Sunday Worship message uploaded successfully.",
        time: "Today",
        color: "purple",
    },
    {
        id: 5,
        icon: Users,
        title: "Volunteer Joined",
        description: "Michael joined the Evangelism Team.",
        time: "Yesterday",
        color: "pink",
    },
];

export default function ActivityTimeline() {
    return (
        <section className="activity-timeline">

            <div className="activity-header">

                <div>
                    <h2>Recent Activities</h2>

                    <p>
                        Latest church activities and updates
                    </p>
                </div>

                <div className="activity-clock">

                    <Clock size={22} />

                </div>

            </div>

            <div className="timeline">

                {activities.map((activity) => {

                    const Icon = activity.icon;

                    return (

                        <div
                            key={activity.id}
                            className="timeline-item"
                        >

                            <div
                                className={`timeline-icon ${activity.color}`}
                            >

                                <Icon size={22} />

                            </div>

                            <div className="timeline-card">

                                <div className="timeline-top">

                                    <div>

                                        <h3 className="timeline-title">

                                            {activity.title}

                                        </h3>

                                        <p className="timeline-description">

                                            {activity.description}

                                        </p>

                                    </div>

                                    <span className="timeline-time">

                                        {activity.time}

                                    </span>

                                </div>

                            </div>

                        </div>

                    );

                })}

            </div>

            <button className="activity-button">

                View All Activities

            </button>

        </section>
    );
}