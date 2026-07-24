const HowItWorks = () => {

    const steps = [
        {
            number: "01",
            title: "Create Account",
            description:
                "Join Gig Market and build your profile."
        },

        {
            number: "02",
            title: "Post or Find Work",
            description:
                "Create tasks or discover opportunities."
        },

        {
            number: "03",
            title: "Complete & Earn",
            description:
                "Work together, build reputation, and grow."
        }
    ];


    return (

        <section className="px-8 py-20">

            <div className="text-center mb-12">

                <h2 className="text-4xl font-bold">
                    How Gig Market Works
                </h2>

                <p className="mt-4 text-gray-600">
                    A simple way to connect skills with opportunities.
                </p>

            </div>


            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">


                {steps.map((step)=>(
                    
                    <div 
                        key={step.number}
                        className="p-8 rounded-3xl border hover:shadow-lg transition"
                    >

                        <div className="text-5xl font-bold text-gray-200">
                            {step.number}
                        </div>


                        <h3 className="mt-5 text-xl font-semibold">
                            {step.title}
                        </h3>


                        <p className="mt-3 text-gray-600">
                            {step.description}
                        </p>


                    </div>

                ))}


            </div>

        </section>

    );

};


export default HowItWorks;