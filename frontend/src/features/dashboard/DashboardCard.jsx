import { Link } from "react-router-dom";


const DashboardCard = ({ feature }) => {

    const isAvailable =
        feature.status === "available";


    return (

        <Link
            to={feature.path}
            className="
                group
                border
                rounded-2xl
                p-5
                bg-white
                hover:shadow-lg
                hover:-translate-y-1
                transition
                block
            "
        >

            <div className="flex items-start justify-between gap-4">

                <div
                    className="
                        w-10
                        h-10
                        rounded-xl
                        bg-black
                        text-white
                        flex
                        items-center
                        justify-center
                        font-semibold
                    "
                >
                    {feature.number}
                </div>


                <span
                    className={`
                        text-xs
                        px-3
                        py-1
                        rounded-full
                        ${
                            isAvailable
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-100 text-gray-500"
                        }
                    `}
                >

                    {isAvailable
                        ? "Available"
                        : "Coming Soon"}

                </span>

            </div>


            <h3 className="mt-5 text-lg font-semibold">
                {feature.title}
            </h3>


            <p className="mt-2 text-sm text-gray-600 leading-6">
                {feature.description}
            </p>


            <div className="mt-5 text-sm font-medium">

                Open Feature →

            </div>

        </Link>

    );

};


export default DashboardCard;