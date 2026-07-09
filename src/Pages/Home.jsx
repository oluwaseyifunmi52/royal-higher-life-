import BeliefCard from "../Components/Cards/BeliefCard.jsx";
import Hero from "../Components/Hero.jsx";
import SocialLinks from "../Components/SocialLinks.jsx";

const beliefs = [
    ["1. The Bible", "We believe the Holy Bible is the inspired and infallible Word of God and the final authority for faith and life.", "2 Timothy 3:16-17; 2 Peter 1:20-21"],
    ["2. The Trinity", "We believe in one God eternally existing in three persons: Father, Son, and Holy Spirit.", "Matthew 28:19; John 1:1-3"],
    ["3. Jesus Christ", "We believe that Jesus Christ is the Son of God, who died for the sins of humanity and rose again, bringing salvation to all who believe.", "John 3:16; Romans 5:8"],
    ["4. Salvation", "Salvation is the act of God's grace whereby we receive forgiveness for sins and stand before God as though we had never sinned.", "Romans 5:1; 2 Corinthians 5:17"],
    ["5. Sanctification / Holiness", "Sanctification or Holiness is the act of God's grace whereby we are made holy.", "Hebrews 13:12"],
    ["6. Baptism of the Holy Ghost", "The Holy Ghost is the enduement of power from on high upon the clean sanctified life.", "Acts 1:8; Acts 2:1-4"],
    ["7. Divine Healing", "Divine healing of sickness is provided through the atonement.", "James 5:14-16; 1 Peter 2:24"],
    ["8. The Second Coming of Jesus", "The Second Coming of Jesus will be literal and visible as His going away.", "1 Thessalonians 4:16-17"],
    ["9. Tribulation", "The tribulation will occur between Christ's coming for His Bride and His return in judgment.", "Revelation 9 and 16"],
    ["10. Christ's Millennial Reign", "Christ's Millennial Reign is the literal 1000 years of peaceful reign by Jesus on earth.", "Isaiah 11 and 35"],
    ["11. The Great White Throne Judgment", "The final judgment when all the wicked dead will stand before God.", "Revelation 20:11-15"],
    ["12. The New Heaven and the New Earth", "The New Heaven and New Earth will replace the present heaven and earth.", "Revelation 21:1-3"],
    ["13. Eternal Heaven and Eternal Hell", "Eternal Heaven and Eternal Hell are literal places of final destiny.", "Matthew 25:41-46"],
    ["14. Marriage is for Life", "Marriage is a holy institution binding before God.", "Mark 10:6-12"],
    ["15. Restitution", "Restitution is where wrongs against others are made right.", "Matthew 5:23-24"],
    ["16. Water Baptism", "Water baptism is by immersion in the name of the Father, Son, and Holy Spirit.", "Matthew 28:19"],
    ["17. The Lord's Supper", "The Lord's Supper is to remember His death until He returns.", "1 Corinthians 11:23-26"],
    ["18. Washing the Disciples Feet", "Washing the disciples' feet is practiced according to Jesus' command.", "John 13:14-15"],
];

export default function Home() {
    return (
        <>
            <Hero title="Welcome to Royal Higher Life">
                Royal Higher Life Christian Ministries (Outreach) is committed to spreading the Gospel of Jesus Christ through
                evangelism, discipleship, and compassionate outreach.
            </Hero>

            <section id="about">
                <div className="card-container">
                    <article className="card">
                        <h3>Mission Statement</h3>
                        <p>
                            "To reach children, youth, and communities with the Gospel of Jesus Christ through evangelism and
                            discipleship, raising people to live a higher life in Christ."
                        </p>
                    </article>
                    <article className="card">
                        <h3>Vision Statement</h3>
                        <p>
                            "To raise a generation of believers who live the higher life of holiness in Christ and impact nations
                            through the Gospel."
                        </p>
                    </article>
                </div>

                <article className="card single-card">
                    <h3>What We Do</h3>
                    <h4>Our ministry focuses on:</h4>
                    <ul>
                        <li>Evangelism</li>
                        <li>Community Outreach</li>
                        <li>Ministry to Traditional Rulers</li>
                        <li>Youth & Children Ministry</li>
                        <li>Teaching and Discipleship</li>
                        <li>Prayer & Spiritual Support</li>
                        <li>Seminars for Ministers</li>
                    </ul>
                </article>
            </section>

            <section className="cta">
                <h2>Join Us in the Mission</h2>
                <p>Be part of what God is doing through Royal Higher Life Ministries.</p>
                <div className="cta-buttons">
                    <a href="/mission">Join the Mission</a>
                    <a href="/contact">Register Outreach</a>
                    <a href="/contact">Become Volunteer</a>
                    <a href="/contact#prayerForm">Request Prayer</a>
                    <a className="support" href="/donate">
                        Support
                    </a>
                </div>
            </section>

            <section id="Message">
                <div className="Message-container">
                    <article className="card impact-message">
                        <h3>Impact Message</h3>
                        <p>
                            Since its beginning, the ministry has been committed to taking the Gospel to streets, villages, and
                            communities, raising a generation that will live for Christ and impact the world.
                        </p>
                    </article>
                    <article className="card closing-inspiration">
                        <h3>Closing Inspiration</h3>
                        <p>"Together, we can take the message of Jesus Christ to every street, every village, and every heart."</p>
                    </article>
                    <article className="card mission-statement">
                        <h3>Mission Statement</h3>
                        <p>
                            "To proclaim the Gospel of Jesus Christ through evangelism and outreach, raise disciples through the
                            teaching of God's Word, and empower believers to live holy and victorious lives by the power of the Holy
                            Spirit."
                        </p>
                    </article>
                </div>
            </section>

            <section id="Beliefs">
                <div className="belief-section">
                    <h2 className="section-title">Beliefs / Statement of Faith</h2>
                </div>
                <div className="Message-container beliefs-container">
                    {beliefs.map(([title, text, reference]) => (
                        <BeliefCard key={title} reference={reference} title={title}>
                            {text}
                        </BeliefCard>
                    ))}
                </div>
            </section>
            <SocialLinks />
        </>
    );
}