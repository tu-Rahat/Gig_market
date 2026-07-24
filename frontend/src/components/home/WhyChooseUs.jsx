const WhyChooseUs = () => {

    const features = [
        {
            title: "Secure Payments",
            description:
                "Complete transactions safely with a trusted payment system."
        },

        {
            title: "Transparent Bidding",
            description:
                "Compare offers and choose the right person for your task."
        },

        {
            title: "Skill-Based Marketplace",
            description:
                "Connect with people based on skills, experience, and needs."
        },

        {
            title: "Ratings & Reviews",
            description:
                "Build trust through feedback and completed work history."
        }
    ];


    return (

        <section className="px-8 py-20">


            <div className="text-center mb-12">

                <h2 className="text-4xl font-bold">
                    Why Choose Gig Market?
                </h2>

                <p className="mt-4 text-gray-600">
                    Everything you need to collaborate confidently.
                </p>

            </div>


            <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-6">


                {features.map((feature)=>(

                    <div
                        key={feature.title}
                        className="
                        p-6
                        rounded-2xl
                        border
                        hover:shadow-lg
                        transition
                        "
                    >

                        <h3 className="text-xl font-semibold">
                            {feature.title}
                        </h3>


                        <p className="mt-3 text-gray-600">
                            {feature.description}
                        </p>

                    </div>

                ))}


            </div>


        </section>

    );

};


export default WhyChooseUs;