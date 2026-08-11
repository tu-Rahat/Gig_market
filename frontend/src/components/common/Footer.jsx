import { Link } from "react-router-dom";

const Footer = () => {

    return (

        <footer className="relative overflow-hidden bg-neutral-950 text-white px-8 py-14">


            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.09),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.06),transparent_28%)] pointer-events-none" />


            <div className="relative max-w-6xl mx-auto grid gap-10 md:grid-cols-3 md:items-start">


                <div className="self-start">

                    <h2 className="text-3xl font-bold tracking-tight">
                        Gig Market
                    </h2>


                    <p className="mt-4 max-w-md text-gray-400 leading-7">
                        Connecting skills with opportunities. Find trusted workers, post tasks, and manage verification in one place.
                    </p>

                </div>



                <div className="self-start">

                    <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-white/70">
                        Platform
                    </h3>


                    <ul className="mt-5 space-y-3 text-gray-400">

                        <li>
                            <Link to="/tasks/browse" className="inline-flex hover:text-white transition-colors">
                                Find Work
                            </Link>
                        </li>

                        <li>
                            <Link to="/tasks/create" className="inline-flex hover:text-white transition-colors">
                                Post a Task
                            </Link>
                        </li>

                        <li>
                            <Link to="/" className="inline-flex hover:text-white transition-colors">
                                About Us
                            </Link>
                        </li>

                    </ul>

                </div>



                <div className="self-start">

                    <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-white/70">
                        Contact
                    </h3>


                    <div className="mt-5 space-y-4 text-gray-400">
                        <a href="mailto:support@gigmarket.com" className="block hover:text-white transition-colors">
                            support@gigmarket.com
                        </a>
                    </div>

                </div>


            </div>



            <div className="relative mt-12 border-t border-white/10 pt-6 text-center text-sm text-gray-500">

                © 2026 Gig Market. All rights reserved.

            </div>


        </footer>

    );

};


export default Footer;