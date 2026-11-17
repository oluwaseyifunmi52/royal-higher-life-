import { Link } from "react-router-dom";
import asset from "../assets/royal 3.jpeg";
import SEO from "../Components/SEO.jsx";

export default function About() {
    return (
        <>
            <SEO
                title="About Us - Royal HigherLife Christian Ministries"
                description="Learn about Royal HigherLife Christian Ministries' mission, vision, core values, statement of faith, and ministry activities across Nigeria, Benin Republic, and Togo."
                url="/about"
                type="website"
            />
            
            <section className="about-section" id="intro">
                <div className="container">
                    <div className="page-header">
                        <h1 className="section-title">Royal HigherLife Christian Ministries (Outreach)</h1>
                        <p className="section-subtitle">
                            A Christian outreach ministry dedicated to spreading the Gospel of Jesus Christ and raising 
                            people to live a victorious and holy life in Him.
                        </p>
                    </div>

                    {/* Mission & Vision */}
                    <div className="card-container">
                        <article className="card" id="mission">
                            <h2>Our Mission</h2>
                            <p>
                                We are dedicated to spreading the Gospel of Jesus Christ and reaching souls in communities, villages,
                                and streets. Our mission is to see lives transformed through salvation, sanctification, the baptism of
                                the Holy Spirit, and discipleship.
                            </p>
                        </article>
                        <article className="card" id="vision">
                            <h2>Our Vision</h2>
                            <p>
                                "To raise a generation of believers who live the higher life of holiness in Christ and impact their
                                communities and nations through the power of the Gospel."
                            </p>
                        </article>
                    </div>

                    {/* What We Do */}
                    <article className="card single-card" id="activities">
                        <h2>What We Do</h2>
                        <p>
                            We are not a church or a network of churches. We are an evangelistic outreach ministry focused on taking the Gospel 
                            beyond church walls, reaching communities, making disciples, and transforming lives through the power of God's Word.
                        </p>
                        <h4>Our Core Activities:</h4>
                        <ul>
                            <li>Street Evangelism</li>
                            <li>Village Outreach</li>
                            <li>Youth & Children Ministry</li>
                            <li>Discipleship & Teaching</li>
                            <li>King's Ministry (Ministry to Traditional Rulers)</li>
                            <li>Prison Ministry</li>
                            <li>Leadership Development</li>
                            <li>Prayer Ministry</li>
                            <li>Church Planting</li>
                            <li>Bible Distribution</li>
                            <li>Community Support & Development</li>
                            <li>Seminars for Ministers</li>
                        </ul>
                    </article>

                    {/* Core Values */}
                    <article className="card single-card" id="values">
                        <h2>Core Values</h2>
                        <div className="values-grid">
                            <div className="value-item">
                                <h3>Christ-Centered</h3>
                                <p>Jesus Christ is the center of everything we do. He is our message, our model, and our Master.</p>
                            </div>
                            <div className="value-item">
                                <h3>Biblical Authority</h3>
                                <p>The Bible is our final authority for faith and practice. We teach and live by God's Word.</p>
                            </div>
                            <div className="value-item">
                                <h3>Holiness</h3>
                                <p>We pursue a life of holiness and purity, reflecting God's character in all we do.</p>
                            </div>
                            <div className="value-item">
                                <h3>Compassion</h3>
                                <p>We serve with the heart of Christ, meeting physical and spiritual needs with love.</p>
                            </div>
                            <div className="value-item">
                                <h3>Excellence</h3>
                                <p>We give our best to God in every endeavor, from preaching to community development.</p>
                            </div>
                            <div className="value-item">
                                <h3>Multiplication</h3>
                                <p>We invest in leaders who reproduce disciples, churches, and ministries for God's kingdom.</p>
                            </div>
                        </div>
                    </article>

                    {/* Statement of Faith */}
                    <article className="card single-card" id="faith">
                        <h2>Statement of Faith</h2>
                        <p>We hold to these fundamental truths:</p>
                        <ul>
                            <li><strong>The Bible:</strong> The inspired, infallible, authoritative Word of God (2 Timothy 3:16-17)</li>
                            <li><strong>The Trinity:</strong> One God in three Persons: Father, Son, and Holy Spirit (Matthew 28:19)</li>
                            <li><strong>Jesus Christ:</strong> Son of God, virgin birth, sinless life, miracles, atoning death, resurrection, ascension (John 3:16)</li>
                            <li><strong>Salvation:</strong> By grace through faith in Christ alone (Ephesians 2:8-9)</li>
                            <li><strong>Sanctification:</strong> The act of God's grace making us holy (Hebrews 13:12)</li>
                            <li><strong>Baptism of the Holy Spirit:</strong> Enduement of power for service (Acts 1:8)</li>
                            <li><strong>Divine Healing:</strong> Provided through Christ's atonement (James 5:14-16)</li>
                            <li><strong>Second Coming:</strong> Literal, visible return of Jesus Christ (1 Thessalonians 4:16-17)</li>
                            <li><strong>Eternal Judgment:</strong> Heaven and Hell are real places (Matthew 25:41-46)</li>
                            <li><strong>Marriage:</strong> Holy covenant between one man and one woman for life (Mark 10:6-12)</li>
                            <li><strong>Water Baptism:</strong> By immersion in the name of the Father, Son, and Holy Spirit (Matthew 28:19)</li>
                            <li><strong>The Lord's Supper:</strong> Remembering Christ's death until He returns (1 Corinthians 11:23-26)</li>
                        </ul>
                    </article>

                    {/* Mission Fields */}
                    <article className="card wide-card" id="fields">
                        <h2>Our Mission Fields</h2>
                        <p>
                            The areas listed below are our mission fields. We regularly go into these communities
                            to preach, disciple, and support spiritual growth.
                        </p>
                        <div className="locations">
                            <div>
                                <h3>Ogun State</h3>
                                <p>Alabata, Fojobayi, Ayeogun, Onisemo, Alata, Dopamu, Kobape, Ibara-rile, Isaga-Orile, Ilewo-Orile, Sagamu, Abeokuta Township and environs</p>
                            </div>
                            <div>
                                <h3>Oyo State</h3>
                                <p>Badeku, Adekanra, Olofa, Bioku, Elerumoke, Akinwande, Agbo, Aba-Kutonu, Kupalo, Laboru, Elewura, Eletu, Onipaanu, Aba-Osho, Adigbe, Gbalefa, Ojoku, Ajia, Lademo, Abule-Elesu, Jago, Ogunbumi, Alaase, Alagbede, Butubutu, Tadi, Abegunje</p>
                            </div>
                            <div>
                                <h3>Osun State</h3>
                                <p>Onila, Onilu, Onigangan, Osunwoyin, Akinola-Baase, Station</p>
                            </div>
                            <div>
                                <h3>Republic of Benin</h3>
                                <p>Save, Aguoa, Asaaba, Tchetti</p>
                            </div>
                            <div>
                                <h3>Togo</h3>
                                <p>Kaboli, Brekete, Gubi</p>
                            </div>
                        </div>
                    </article>

                    {/* Founder */}
                    <article className="card" id="founder">
                        <h2>Founder</h2>
                        <p>
                            The ministry was founded by a passionate servant of God with a burden to reach souls and raise disciples
                            for Christ. Beginning with a small group of children, the outreach has grown into active evangelism
                            across communities and villages.
                        </p>
                        <p>
                            Through dedication to prayer, teaching the Word of God, and evangelism, the ministry continues to impact
                            lives and raise believers to live a higher life in Christ.
                        </p>
                    </article>
                </div>
            </section>
        </>
    );
}