const Categories = () => {

    const categories = [
        "Web Development",
        "Graphic Design",
        "Digital Marketing",
        "Writing & Translation",
        "Video Editing",
        "Tutoring",
        "Repair Services",
        "Business Support"
    ];


    return (

        <section className="px-8 py-20 bg-gray-50">


            <div className="text-center mb-12">

                <h2 className="text-4xl font-bold">
                    Explore Categories
                </h2>

                <p className="mt-4 text-gray-600">
                    Find the right skills for every project.
                </p>

            </div>


            <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">


                {categories.map((category) => (

                    <div
                        key={category}
                        className="
                        p-6
                        bg-white
                        rounded-2xl
                        border
                        hover:shadow-lg
                        transition
                        text-center
                        font-medium
                        "
                    >

                        {category}

                    </div>

                ))}


            </div>


        </section>

    );

};


export default Categories;