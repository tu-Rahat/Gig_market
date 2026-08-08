import { Link, useLocation } from "react-router-dom";


const FeaturePlaceholder = () => {

    const location = useLocation();


    return (

        <div
            className="
                min-h-[70vh]
                flex
                items-center
                justify-center
                px-6
            "
        >

            <div
                className="
                    max-w-lg
                    w-full
                    border
                    rounded-3xl
                    p-10
                    text-center
                "
            >

                <div
                    className="
                        w-14
                        h-14
                        bg-black
                        text-white
                        rounded-2xl
                        mx-auto
                        flex
                        items-center
                        justify-center
                        text-xl
                    "
                >
                    →
                </div>


                <h1 className="text-3xl font-bold mt-6">

                    Feature Coming Soon

                </h1>


                <p className="text-gray-600 mt-4">

                    The route

                    <span className="font-medium text-black">
                        {" "}
                        {location.pathname}
                    </span>

                    {" "}is already reserved for this
                    Gig Market feature.

                </p>


                <Link
                    to="/dashboard"
                    className="
                        inline-block
                        mt-7
                        bg-black
                        text-white
                        px-6
                        py-3
                        rounded-xl
                    "
                >

                    Back to Dashboard

                </Link>


            </div>

        </div>

    );

};


export default FeaturePlaceholder;