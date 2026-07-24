const Footer = () => {

    return (

        <footer className="bg-black text-white px-8 py-12">


            <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">


                <div>

                    <h2 className="text-2xl font-bold">
                        Gig Market
                    </h2>


                    <p className="mt-4 text-gray-400">
                        Connecting skills with opportunities.
                    </p>

                </div>



                <div>

                    <h3 className="font-semibold text-lg">
                        Platform
                    </h3>


                    <ul className="mt-4 space-y-2 text-gray-400">

                        <li>
                            Find Work
                        </li>

                        <li>
                            Post a Task
                        </li>

                        <li>
                            About Us
                        </li>

                    </ul>

                </div>



                <div>

                    <h3 className="font-semibold text-lg">
                        Contact
                    </h3>


                    <p className="mt-4 text-gray-400">
                        support@gigmarket.com
                    </p>

                </div>


            </div>



            <div className="border-t border-gray-800 mt-10 pt-6 text-center text-gray-500">

                © 2026 Gig Market. All rights reserved.

            </div>


        </footer>

    );

};


export default Footer;