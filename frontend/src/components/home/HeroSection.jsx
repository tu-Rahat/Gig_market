const HeroSection = () => {

    return (

        <section className="min-h-[80vh] flex items-center justify-center px-8">

            <div className="text-center max-w-4xl">


                <h1 className="text-6xl font-bold leading-tight">

                    Find Skills.
                    <br />

                    Offer Services.
                    <br />

                    Build Opportunities.

                </h1>


                <p className="mt-6 text-xl text-gray-600">

                    Gig Market connects people who need work
                    with talented individuals ready to deliver.

                </p>


                <div className="mt-8 flex justify-center gap-5">


                    <button className="bg-black text-white px-8 py-4 rounded-2xl text-lg">

                        Find Work

                    </button>


                    <button className="border border-gray-300 px-8 py-4 rounded-2xl text-lg">

                        Post a Task

                    </button>


                </div>


            </div>


        </section>

    );

};


export default HeroSection;