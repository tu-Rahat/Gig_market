import DashboardCard from "./DashboardCard";


const DashboardSection = ({
    title,
    description,
    features,
}) => {

    return (

        <section className="mt-14">


            <div>

                <h2 className="text-2xl font-bold">
                    {title}
                </h2>


                <p className="mt-2 text-gray-600">
                    {description}
                </p>

            </div>


            <div
                className="
                    grid
                    sm:grid-cols-2
                    lg:grid-cols-3
                    gap-5
                    mt-7
                "
            >

                {features.map((feature) => (

                    <DashboardCard
                        key={feature.number}
                        feature={feature}
                    />

                ))}

            </div>


        </section>

    );

};


export default DashboardSection;